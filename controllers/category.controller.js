import Category from "../models/category.model.js";
import {
  createOne,
  deleteOne,
  getAll,
  updateOne,
  getOne,
} from "./base.controller.js";

/**
 * @desc   Get all categories with pagination
 * @route  GET /api/v1/categories
 * @access Public
 */
const getAllCategories = getAll(Category);

/**
 * @desc   Create new category
 * @route  POST /api/v1/categories
 * @access Private
 */
const createCategory = createOne(Category);

/**
 * @desc   Update category by ID
 * @route  PUT /api/v1/categories/:id
 * @access Private
 */
const updateCategory = updateOne(Category);

/**
 * @desc   Delete category by ID
 * @route  DELETE /api/v1/categories/:id
 * @access Private
 */
const deleteCategory = deleteOne(Category);

/**
 * @desc   Get single category by ID
 * @route  GET /api/v1/categories/:id
 * @access Public
 */
const getSpecificCategory = getOne(Category);

export {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
};
