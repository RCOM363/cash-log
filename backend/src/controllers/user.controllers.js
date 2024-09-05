import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Expense } from "../models/expense.model.js";
import { Income } from "../models/income.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    console.log(accessToken, refreshToken);
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens!"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log(fullName, email, password);

  if ([fullName, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required!");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User with the same email already exists");
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering a user");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: true,
  };

  console.log("User registered successfully");
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required!");
  }

  if (!password) {
    throw new ApiError(400, "password is required to login!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "user does not exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect password!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  console.log("User logged in successfully");
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  console.log("User logged out successfully");
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized access");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "refresh token expired or used");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token");
  }
});

const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("fullName email");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Get current month start and end dates
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const endOfYear = new Date(today.getFullYear(), 11, 31);

  // console.log(startOfMonth, endOfMonth);

  // Fetch expenses and incomes for the current year
  const expenses = await Expense.find({
    user: userId,
    date: { $gte: startOfYear, $lte: endOfYear },
  }).select("amount date");

  const incomes = await Income.find({
    user: userId,
    date: { $gte: startOfYear, $lte: endOfYear },
  }).select("amount date");

  // Aggregate data by month
  const expensesByMonth = Array(12).fill(0);
  const incomesByMonth = Array(12).fill(0);

  expenses.forEach((expense) => {
    const month = new Date(expense.date).getMonth();
    expensesByMonth[month] += expense.amount;
  });

  incomes.forEach((income) => {
    const month = new Date(income.date).getMonth();
    incomesByMonth[month] += income.amount;
  });

  // Fetch expenses and incomes for the current month
  const monthlyExpenses = await Expense.find({
    user: userId,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  }).select("amount date");

  const monthlyIncomes = await Income.find({
    user: userId,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  }).select("amount date");

  // Fetch expenses and incomes for the current year
  const yearlyExpenses = await Expense.find({
    user: userId,
    date: { $gte: startOfYear, $lte: endOfYear },
  }).select("amount date");

  const yearlyIncomes = await Income.find({
    user: userId,
    date: { $gte: startOfYear, $lte: endOfYear },
  }).select("amount date");

  // Calculate total expenses and incomes for the current month
  const monthlyTotalExpenses = monthlyExpenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );
  const monthlyTotalIncomes = monthlyIncomes.reduce(
    (acc, income) => acc + income.amount,
    0
  );

  // Calculate total expenses and incomes for the current year
  const yearlyTotalExpenses = yearlyExpenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );
  const yearlyTotalIncomes = yearlyIncomes.reduce(
    (acc, income) => acc + income.amount,
    0
  );

  // Prepare data for the line graph
  const monthlyExpensesData = monthlyExpenses.map((expense) => ({
    x: new Date(expense.date),
    y: expense.amount,
  }));

  const monthlyIncomesData = monthlyIncomes.map((income) => ({
    x: new Date(income.date),
    y: income.amount,
  }));

  const expensesByCategory = await Expense.aggregate([
    {
      $match: { user: userId, date: { $gte: startOfYear, $lte: endOfYear } },
    },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    { $project: { _id: 0, category: "$category.name", total: 1 } },
  ]);

  const incomesByCategory = await Income.aggregate([
    {
      $match: { user: userId, date: { $gte: startOfYear, $lte: endOfYear } },
    },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    { $project: { _id: 0, category: "$category.name", total: 1 } },
  ]);

  const monthlyExpensesByCategory = await Expense.aggregate([
    {
      $match: { user: userId, date: { $gte: startOfMonth, $lte: endOfMonth } },
    },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    { $project: { _id: 0, category: "$category.name", total: 1 } },
  ]);

  const monthlyIncomesByCategory = await Income.aggregate([
    {
      $match: { user: userId, date: { $gte: startOfYear, $lte: endOfYear } },
    },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    { $project: { _id: 0, category: "$category.name", total: 1 } },
  ]);

  console.log(yearlyTotalExpenses, yearlyTotalIncomes);

  const data = {
    fullName: user.fullName,
    email: user.email,
    monthlyTotalExpenses,
    monthlyTotalIncomes,
    monthlyExpensesData,
    monthlyIncomesData,
    monthlyExpensesByCategory,
    monthlyIncomesByCategory,
    yearlyTotalExpenses,
    yearlyTotalIncomes,
    expensesByMonth,
    incomesByMonth,
    expensesByCategory,
    incomesByCategory,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Dashboard data retrieved successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getDashboardData,
};
