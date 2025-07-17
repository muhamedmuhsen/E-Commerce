import slugify from "slugify";
import asyncWraper from "../middlewares/asyncWraper.js";
import Category from "../models/category.model.js";
import ApiError from "../utils/ApiError.js";

const createCategory = asyncWraper(async (req, res, next) => {
  const category = req.body;

  if (!category || !category.name) {
    return next(new ApiError('"Category name is required"', 400));
  }

  const addedCategory = new Category({
    slug: slugify(category.name),
    ...category,
  });

  await addedCategory.save();

  res.status(201).json({ success: true, data: addedCategory });
});

const getAllCategories = asyncWraper(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const offset = (page - 1) * limit;

  const categories = await Category.find().skip(offset).limit(limit);
  res.status(200).json({ success: true, page: page, data: { categories } });
});

const updateCategory = asyncWraper(async (req, res, next) => {
  const { name } = req.body;
  const id = req.params.id;

  if (!name) {
    return next(new ApiError('"Category name is required"', 400));
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    {
      name: name,
      slug: slugify(name),
    },
    { new: true }
  );

  if (!updatedCategory) {
    return next(new ApiError('"Category not found"', 404));
  }

  res.status(200).json({ success: true, data: updatedCategory });
});

const deleteCategory = asyncWraper(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next(new ApiError("invalid id", 400));
  }
  const deletedCategory = await Category.findByIdAndDelete(id);
  if (!deletedCategory) {
    return next(new ApiError("Category not found", 404));
  }
  res.status(200).json({ success: true, data: [] });
});

const getSpecificCategory = asyncWraper(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next(new ApiError("invalid id", 400));
  }
  const category = await Category.findById(id);

  if (!category) {
    return next(new ApiError("Category not found", 404));
  }

  res.status(200).json({ success: true, data: category });
});

export {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
};
