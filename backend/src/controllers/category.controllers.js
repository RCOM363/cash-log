import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({
    user: req.user?._id,
    type: req.params?.type,
  });

  if (!categories) {
    throw new ApiError(404, "No categories found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, categories, "categories retrieved successfully")
    );
});

export { getCategories };
