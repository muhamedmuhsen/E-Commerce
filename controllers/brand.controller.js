import Brand from "../models/brand.model.js";
import {
  deleteOne,
  createOne,
  getAll,
  updateOne,
  getOne,
} from "./base.controller.js";

// TODO(handle profile image)
/**
 * @desc   Get all brands with pagination
 * @route  GET /api/v1/brands
 * @access Public
 */
const getAllBrand = getAll(Brand);

/**
 * @desc   Create new brand
 * @route  POST /api/v1/brands
 * @access Private
 */
const createBrand = createOne(Brand);

/**
 * @desc   Update brand by ID
 * @route  PUT /api/v1/brands/:id
 * @access Private
 */
const updateBrand = updateOne(Brand);

/**
 * @desc   Get single brand by ID
 * @route  GET /api/v1/brands/:id
 * @access Public
 */
const getSpecificBrand = getOne(Brand);
/**
 * @desc   Delete brand by ID
 * @route  DELETE /api/v1/brands/:id
 * @access Private
 */
const deleteBrand = deleteOne(Brand);

export { createBrand, deleteBrand, getAllBrand, getSpecificBrand, updateBrand };
