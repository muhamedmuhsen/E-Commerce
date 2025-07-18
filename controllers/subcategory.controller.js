import slugify from "slugify";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import Category from "../models/category.model.js";
import SubCategory from "../models/subcategory.model.js";
import ApiError from "../utils/ApiError.js";

const setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.id;
  }
  next();
};

const setFilterObject = (req, res, next) => {
  let filterObject = {};

  console.log(req.params);

  if (req.params.id) {
    filterObject = { category: req.params.id };
  }
  req.filterObject = filterObject;
  next();
};

const createSubCategory = asyncWrapper(async (req, res, next) => {
  const { name, category } = req.body;

  console.log(req.params);

  if (!name) {
    return next(new ApiError("SubCategory name is required", 400));
  }
  if (!category) {
    req.body.category = req.params.id;
    category = req.params.id;
  }

  const ParentCategory = await Category.findById(category);

  if (!ParentCategory) {
    return next(new ApiError("Paretnt category not found", 404));
  }

  const addedSubCategory = new SubCategory({
    slug: slugify(name),
    name: name,
    category: category,
  });

  await addedSubCategory.save();

  res.status(201).json({ success: true, data: addedSubCategory });
});

const getAllSubCategories = asyncWrapper(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const offset = (page - 1) * limit;

  const subcategories = await SubCategory.find(req.filterObject)
    .skip(offset)
    .limit(limit);

  res.status(200).json({ success: true, page: page, data: { subcategories } });
});

const updateSubCategory = asyncWrapper(async (req, res, next) => {
  const { name, category } = req.body;
  const id = req.params.id;

  if (!name) {
    return next(new ApiError("Category name is required", 400));
  }
  if (!category) {
    return next(new ApiError("Parent Category name is required", 400));
  }
  const ParentCategory = await Category.findById(category);

  if (!ParentCategory) {
    return next(new ApiError("Paretnt category not found", 404));
  }

  const updatedSubCategory = await SubCategory.findByIdAndUpdate(
    id,
    {
      name: name,
      category: category,
      slug: slugify(name),
    },
    { new: true }
  );

  if (!updatedSubCategory) {
    return next(new ApiError("SubCategory not found", 404));
  }

  res.status(200).json({ success: true, data: updatedSubCategory });
});

const deleteSubCategory = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next(new ApiError("Invalid id", 400));
  }
  const deletedSubCategory = await SubCategory.findByIdAndDelete(id);
  if (!deletedSubCategory) {
    return next(new ApiError("SubCategory not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "subcategory deleted successfully",
    data: deletedSubCategory,
  });
});

const getSpecificSubCategory = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next(new ApiError("Invalid id", 400));
  }
  const subcategory = await SubCategory.findById(id);

  if (!subcategory) {
    return next(new ApiError("SubCategory not found", 404));
  }

  res.status(200).json({ success: true, data: subcategory });
});

const createSubCategoryOnCategory = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const subCategory = req.body;
  if (!id) {
    return next(new ApiError("Invalid id", 400));
  }

  if (!subCategory) {
    return next(new ApiError("subcategory name is required", 400));
  }

  const ParentCategory = await Category.findById(id);

  if (!ParentCategory) {
    return next(new ApiError("Paretnt category not found", 404));
  }

  const newSubCategory = new SubCategory({
    category: ParentCategory._id,
    slug: slugify(subCategory.name),
    name: subCategory.name,
  });

  await newSubCategory.save();

  res.status(201).json({ success: true, data: newSubCategory });
});

export {
  createSubCategory,
  createSubCategoryOnCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSpecificSubCategory,
  setCategoryIdToBody,
  setFilterObject,
  updateSubCategory,
};
