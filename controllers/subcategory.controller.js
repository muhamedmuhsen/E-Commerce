import slugify from "slugify";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import Category from "../models/category.model.js";
import SubCategory from "../models/subcategory.model.js";
import { BadRequestError, NotFoundError } from "../utils/ApiErrors.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlersFactory.js";

const setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.id;
  }
  next();
};

const setFilterObject = (req, res, next) => {
  let filterObject = {};

  if (req.params.id) {
    filterObject = { category: req.params.id };
  }
  req.filterObject = filterObject;
  next();
};

/*
    @desc   Create new subcategory
    @route  POST /api/v1/subcategories
    @access Private
*/
const createSubCategory = createOne(SubCategory);

/*
    @desc   Get all subcategories with pagination
    @route  GET /api/v1/subcategories
    @access Public
*/
const getAllSubCategories = getAll(SubCategory);

/*
    @desc   Update subcategory by ID
    @route  PUT /api/v1/subcategories/:id
    @access Private
*/
const updateSubCategory = updateOne(SubCategory);

/*
    @desc   Delete subcategory by ID
    @route  DELETE /api/v1/subcategories/:id
    @access Private
*/
const deleteSubCategory = deleteOne(SubCategory);

/*
    @desc   Get single subcategory by ID
    @route  GET /api/v1/subcategories/:id
    @access Public
*/
const getSpecificSubCategory = getOne(SubCategory);

/*
    @desc   Get subcategories by category ID
    @route  GET /api/v1/categories/:categoryId/subcategories
    @access Public
*/
const getSubCategoriesByCategory = asyncWrapper(async (req, res, next) => {
  const categoryId = req.params.categoryId;

  if (!categoryId) {
    return next(new BadRequestError("Invalid category ID", 400));
  }

  const subcategories = await SubCategory.find({ category: categoryId });

  res.status(200).json({ success: true, data: subcategories });
});

const createSubCategoryOnCategory = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const subCategory = req.body;
  if (!id) {
    return next(new BadRequestError("Invalid id", 400));
  }

  if (!subCategory) {
    return next(new BadRequestError("subcategory name is required", 400));
  }

  const ParentCategory = await Category.findById(id);

  if (!ParentCategory) {
    return next(new NotFoundError("Paretnt category not found", 404));
  }

  const newSubCategory = new SubCategory({
    category: ParentCategory._id,
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
  getSubCategoriesByCategory,
};
