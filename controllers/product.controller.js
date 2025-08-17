import slugify from "slugify";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import "../models/category.model.js"; // Also register Category model
import Product from "../models/product.model.js";
import "../models/subcategory.model.js"; // This registers the model
import {ApiError} from "../utils/ApiErrors.js";
import ApiFeatures from "../utils/apiFeatures.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlersFactory.js";

/*
    @desc   Create new product
    @route  POST /api/v1/products
    @access Private
*/
const createProduct = createOne(Product);

/*
    @desc   Get all products with pagination
    @route  GET /api/v1/products
    @access Public
*/
const getAllProducts = getAll(Product);

/*
    @desc   Update product by ID
    @route  PUT /api/v1/products/:id
    @access Private
*/
const updateProduct = updateOne(Product);

/*
    @desc   Delete product by ID
    @route  DELETE /api/v1/products/:id
    @access Private
*/
const deleteProduct = deleteOne(Product);

/*
    @desc   Get single product by ID
    @route  GET /api/v1/products/:id
    @access Public
*/
const getSpecificProduct = getOne(Product);

/*
    @desc   Get products by category ID
    @route  GET /api/v1/products/category/:categoryId
    @access Public
*/
const getProductsByCategory = asyncWrapper(async (req, res, next) => {
  const {categoryId} = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!categoryId) {
    return next(new ApiError("Category ID is required", 400));
  }

  const offset = (page - 1) * limit;

  const products = await Product.find({ category: categoryId })
    .populate("category", "name")
    .populate("subcategories", "name")
    .skip(offset)
    .limit(limit);

  res.status(200).json({
    success: true,
    page: page,
    data: { products },
  });
});

/*
    @desc   Get products by subcategory ID
    @route  GET /api/v1/products/subcategory/:subcategoryId
    @access Public
*/
const getProductsBySubcategory = asyncWrapper(async (req, res, next) => {
  const {subcategoryId} = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!subcategoryId) {
    return next(new ApiError("Subcategory ID is required", 400));
  }

  const offset = (page - 1) * limit;

  const products = await Product.find({ subcategories: subcategoryId })
    .populate("category", "name")
    .populate("subcategories", "name")
    .skip(offset)
    .limit(limit);

  res.status(200).json({
    success: true,
    page: page,
    data: { products },
  });
});

export {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductsByCategory,
  getProductsBySubcategory,
  getSpecificProduct,
  updateProduct,
};
