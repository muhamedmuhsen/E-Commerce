import slugify from "slugify";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import "../models/category.model.js"; // Also register Category model
import Product from "../models/product.model.js";
import "../models/subcategory.model.js"; // This registers the model
import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

/*
    @desc   Create new product
    @route  POST /api/v1/products
    @access Private
*/
const createProduct = asyncWrapper(async (req, res, next) => {
  const product = req.body;

  const addedProduct = new Product({
    slug: slugify(product.title),
    ...product,
  });

  await addedProduct.save();

  res.status(201).json({ success: true, data: addedProduct });
});

/*
    @desc   Get all products with pagination
    @route  GET /api/v1/products
    @access Public
*/
const getAllProducts = asyncWrapper(async (req, res, next) => {
  console.log("Query parameters:", req.query);
  
  // First, let's check if there are any products at all
  const totalProducts = await Product.countDocuments();
  console.log("Total products in database:", totalProducts);
  
  if (totalProducts === 0) {
    return res.status(200).json({
      success: true,
      length: 0,
      message: "No products found in database",
      data: { products: [] },
    });
  }
  
  // Build query
  const apiFeatures = new ApiFeatures(req.query, Product.find())
    .filter()
    .search()
    .sorting()
    .limitFields()
    .Paginate();

  console.log("Final mongoose query:", apiFeatures.mongooseQuery.getOptions());
  
  // execute query
  const products = await apiFeatures.mongooseQuery;
  
  console.log("Products found:", products.length);

  res.status(200).json({
    success: true,
    length: products.length,
    data: { products },
  });
});

/*
    @desc   Update product by ID
    @route  PUT /api/v1/products/:id
    @access Private
*/
const updateProduct = asyncWrapper(async (req, res, next) => {
  const { productDetails } = req.body;
  const id = req.params.id;

  console.log(productDetails);

  const updatedProduct = await Product.findByIdAndUpdate(id, productDetails, {
    new: true,
  })
    .populate({ path: "category", select: "name -_id" })
    .populate({ path: "subcategories", select: "name -_id" });

  if (!updatedProduct) {
    return next(new ApiError("Product not found", 404));
  }

  res.status(200).json({ success: true, data: updatedProduct });
});

/*
    @desc   Delete product by ID
    @route  DELETE /api/v1/products/:id
    @access Private
*/
const deleteProduct = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next(new ApiError("Invalid id", 400));
  }

  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) {
    return next(new ApiError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data: deletedProduct,
  });
});

/*
    @desc   Get single product by ID
    @route  GET /api/v1/products/:id
    @access Public
*/
const getSpecificProduct = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next(new ApiError("Invalid id", 400));
  }

  const product = await Product.findById(id)
    .populate("category", "name")
    .populate("subcategories", "name");

  if (!product) {
    return next(new ApiError("Product not found", 404));
  }

  res.status(200).json({ success: true, data: product });
});

/*
    @desc   Get products by category ID
    @route  GET /api/v1/products/category/:categoryId
    @access Public
*/
const getProductsByCategory = asyncWrapper(async (req, res, next) => {
  const categoryId = req.params.categoryId;
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
  const subcategoryId = req.params.subcategoryId;
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
