import slugify from "slugify";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import "../models/category.model.js"; // Also register Category model
import Product from "../models/product.model.js";
import "../models/subcategory.model.js"; // This registers the model
import ApiError from "../utils/ApiError.js";
import buildFilter from "../utils/buildFilter.js";

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
  // Filtering
  const filter = buildFilter(req.query);

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const offset = (page - 1) * limit;

  let mongooseQuery = Product.find(filter)
    .skip(offset)
    .limit(limit);

  // Sorting
  if (req.query.sort) {
    // 1. Parse the sort parameter
    const { sort = "createdAt:desc" } = req.query.sort;
    const [sortField, sortDirection = "desc"] = sort.split(":");

    // 2. Validate the sort field
    const allowedSortFields = ["price", "name", "createdAt", "rating"];
    if (!allowedSortFields.includes(sortField)) {
      return res.status(400).json({
        error: `Invalid sort field. Allowed fields: ${allowedSortFields.join(
          ", "
        )}`,
      });
    }

    // 3. Validate the sort direction
    if (!["asc", "desc"].includes(sortDirection.toLowerCase())) {
      return res.status(400).json({
        error: 'Invalid sort direction. Use "asc" or "desc"',
      });
    }

    // 4. Convert to MongoDB sort format
    const sortOrder = sortDirection.toLowerCase() === "asc" ? 1 : -1;
    const sortOptions = { [sortField]: sortOrder };

    mongooseQuery = mongooseQuery.sort(sortOptions);
  }else{
    mongooseQuery = mongooseQuery.sort('-createdAt')
  }

  // Field Limiting
  let selectedFields = [];
  if (req.query.fields) {
    const fieldsArr = req.query.fields.split(",").join(" ");
    selectedFields = req.query.fields.split(",");
    mongooseQuery = mongooseQuery.select(fieldsArr);
    console.log(fieldsArr);
  }else{
    mongooseQuery = mongooseQuery.select('-__v -createdAt -updatedAt')
  }

  // Conditional Population - only populate if field is requested or no field selection
  if (!req.query.fields || selectedFields.includes("category")) {
    mongooseQuery = mongooseQuery.populate({ path: "category", select: "name -_id" });
  }
  
  if (!req.query.fields || selectedFields.includes("subcategories")) {
    mongooseQuery = mongooseQuery.populate({ path: "subcategories", select: "name -_id" });
  }

  // Search
  if (req.query.keyword) {
    const query = {};
    query.$or = [
      { title: { $regex: req.query.keyword, $options: "i" } },
      { description: { $regex: req.query.keyword, $options: "i" } },
    ];

    mongooseQuery = mongooseQuery.find(query);
  }

  const products = await mongooseQuery;

  res.status(200).json({
    success: true,
    length: products.length,
    page: page,
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
