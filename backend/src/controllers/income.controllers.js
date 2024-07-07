import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Income } from "../models/income.model.js";
import { Category } from "../models/category.model.js";
import jwt from "jsonwebtoken";

const addIncome = asyncHandler(async (req, res) => {
  const { title, description, amount, date, category } = req.body;

  const incomeDate = new Date(date);
  if (isNaN(incomeDate)) {
    throw new ApiError(400, "Invalid date format");
  }

  const existingCategory = await Category.findOne({
    name: category.toLowerCase(),
    user: req.user._id,
    type: "income",
  });

  let newCategory;

  // Check if the category exists
  if (!existingCategory) {
    try {
      newCategory = await Category.create({
        name: category.toLowerCase(),
        type: "income",
        user: req.user._id,
      });
    } catch (error) {
      throw new ApiError(
        500,
        error?.message || "Something went wrong while adding new category"
      );
    }
  }

  const income = await Income.create({
    title,
    description,
    amount,
    date: incomeDate,
    category: existingCategory ? existingCategory._id : newCategory._id,
    user: req.user._id,
  });

  const addedIncome = await Income.findById(income._id).select(
    "-description -user"
  );

  if (!addedIncome) {
    throw new ApiError(500, "something went wrong while adding the Income");
  }

  console.log("Income added successfully");
  return res
    .status(200)
    .json(new ApiResponse(200, addIncome, "Income added successfully"));
});

const getIncomes = asyncHandler(async (req, res) => {
  const incomes = await Income.find({ user: req.user._id }).exec();

  if (!incomes) {
    throw new ApiError(401, "the user has no Incomes");
  }

  console.log(incomes);
  return res
    .status(200)
    .json(new ApiResponse(200, incomes, "Incomes retrieved successfully"));
});

const deleteIncome = asyncHandler(async (req, res) => {
  const income = await Income.findById(req.params?.id);

  if (!income) {
    throw new ApiError(404, "Income not found");
  }

  const categoryId = income.category;

  await Income.findByIdAndDelete(income._id);

  const incomeInCategory = await Income.find({
    category: categoryId,
    user: req.user._id,
  });

  // Delete the category if no other Incomes exist in it
  if (incomeInCategory.length === 0) {
    await Category.findByIdAndDelete(categoryId);
  }

  console.log("Income deleted successfully");
  return res
    .status(200)
    .json(new ApiResponse(200, "Income deleted successfully"));
});

const updateIncome = asyncHandler(async (req, res) => {
  const { title, description, amount, date, category } = req.body;
  const existingCategory = await Category.findOne({
    name: category.toLowerCase(),
    user: req.user._id,
    type: "income",
  });

  let newCategory;

  if (!existingCategory) {
    try {
      newCategory = await Category.create({
        name: category.toLowerCase(),
        type: "income",
        user: req.user._id,
      });
    } catch (error) {
      throw new ApiError(
        500,
        error?.message || "Something went wrong while adding new category"
      );
    }
  }

  const updatedIncome = await Income.findByIdAndUpdate(
    req.params?.id,
    {
      $set: {
        title,
        description,
        amount,
        date,
        category: existingCategory ? existingCategory._id : newCategory._id,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedIncome) {
    throw new ApiError(404, "Income not found!");
  }

  console.log("Income updated successfully");
  return res
    .status(200)
    .json(new ApiResponse(200, "Income updated successfully"));
});

export { addIncome, getIncomes, deleteIncome, updateIncome };
