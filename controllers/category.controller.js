import slugify from "slugify";
import asyncWrapper  from "../middlewares/asyncWrapper.js";
import Category from "../models/category.model.js";
import ApiError from "../utils/ApiError.js";

const createCategory = asyncWrapper (async (req, res, next) => {
  const category = req.body;

  if (!category || !category.name) {
    return next(new ApiError('Category name is required', 400));
  }

  const addedCategory = new Category({
    slug: slugify(category.name),
    ...category,
  });

  await addedCategory.save();

  res.status(201).json({ success: true, data: addedCategory });
});

const getAllCategories = asyncWrapper (async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const offset = (page - 1) * limit;

  const categories = await Category.find().skip(offset).limit(limit);
  res.status(200).json({ success: true, page: page, data: { categories } });
});

const updateCategory = asyncWrapper  (async (req, res, next) => {
  const { name } = req.body;
  const id = req.params.id;

  if (!name) {
    return next(new ApiError('Category name is required', 400));
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
    return next(new ApiError('Category not found', 404));
  }

  res.status(200).json({ success: true, data: updatedCategory });
});

const deleteCategory = asyncWrapper (async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next(new ApiError("Invalid id", 400));
  }
  const deletedCategory = await Category.findByIdAndDelete(id);
  if (!deletedCategory) {
    return next(new ApiError("Category not found", 404));
  }
  res.status(200).json({ success: true,message:'category deleted successfully', data: deletedCategory });
});

const getSpecificCategory = asyncWrapper (async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next(new ApiError("Invalid id", 400));
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
