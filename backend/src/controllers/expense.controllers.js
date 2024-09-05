import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Expense } from "../models/expense.model.js";
import { Category } from "../models/category.model.js";
import jwt from "jsonwebtoken";

const addExpense = asyncHandler(async (req, res) => {
  const { title, description, amount, date, category } = req.body;

  const expenseDate = new Date(date);
  if (isNaN(expenseDate)) {
    throw new ApiError(400, "Invalid date format");
  }

  const existingCategory = await Category.findOne({
    name: category.toLowerCase(),
    user: req.user._id,
    type: "expense",
  });

  let newCategory;

  // Check if the category exists
  if (!existingCategory) {
    try {
      newCategory = await Category.create({
        name: category.toLowerCase(),
        type: "expense",
        user: req.user._id,
      });
    } catch (error) {
      throw new ApiError(
        500,
        error?.message || "Something went wrong while adding new category"
      );
    }
  }

  const expense = await Expense.create({
    title,
    description,
    amount,
    date: expenseDate,
    category: existingCategory ? existingCategory._id : newCategory._id,
    user: req.user._id,
  });

  const addedExpense = await Expense.findById(expense._id).select(
    "-description -user"
  );

  if (!addedExpense) {
    throw new ApiError(500, "something went wrong while adding the expense");
  }

  console.log("Expense added successfully");
  return res
    .status(200)
    .json(new ApiResponse(200, addExpense, "Expense added successfully"));
});

const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ user: req.user._id }).exec();

  if (!expenses) {
    throw new ApiError(401, "the user has no expenses");
  }

  console.log(expenses);
  return res
    .status(200)
    .json(new ApiResponse(200, expenses, "expenses retrieved successfully"));
});

const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params?.id);

  if (!expense) {
    throw new ApiError(404, "expense not found");
  }

  const categoryId = expense.category;

  await Expense.findByIdAndDelete(expense._id);

  const expenseInCategory = await Expense.find({
    category: categoryId,
    user: req.user._id,
  });

  // Delete the category if no other expenses exist in it
  if (expenseInCategory.length === 0) {
    await Category.findByIdAndDelete(categoryId);
  }

  console.log("Expense deleted successfully");
  return res
    .status(200)
    .json(new ApiResponse(200, "Expense deleted successfully"));
});

const updateExpense = asyncHandler(async (req, res) => {
  const { title, description, amount, date, category } = req.body;

  // Find the original expense before updating
  const originalExpense = await Expense.findById(req.params?.id);

  if (!originalExpense) {
    throw new ApiError(404, "Expense not found!");
  }

  const originalCategoryId = originalExpense.category;

  const existingCategory = await Category.findOne({
    name: category.toLowerCase(),
    user: req.user._id,
    type: "expense",
  });

  let newCategory;

  if (!existingCategory) {
    try {
      newCategory = await Category.create({
        name: category.toLowerCase(),
        type: "expense",
        user: req.user._id,
      });
    } catch (error) {
      throw new ApiError(
        500,
        error?.message || "Something went wrong while adding new category"
      );
    }
  }

  const updatedExpense = await Expense.findByIdAndUpdate(
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

  if (!updatedExpense) {
    throw new ApiError(404, "Expense not found!");
  }

  // Check if the original category has any other expenses
  const expenseInOriginalCategory = await Expense.find({
    category: originalCategoryId,
    user: req.user._id,
  });

  if (expenseInOriginalCategory.length === 0) {
    await Category.findByIdAndDelete(originalCategoryId);
  }

  console.log("Expense updated successfully");
  return res
    .status(200)
    .json(new ApiResponse(200, "Expense updated successfully"));
});

export { addExpense, getExpenses, deleteExpense, updateExpense };
