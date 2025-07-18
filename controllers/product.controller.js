import slugify from "slugify";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import ProductModel from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

const createProduct = asyncWrapper(async (req, res, next) => {
  const product = req.body;

  if (!product || !product.title) {
    return next(new ApiError("Product title is required", 400));
  }

  if (!product.category) {
    return next(new ApiError("Product category is required", 400));
  }

  if (!product.subcategory) {
    return next(new ApiError("Product subcategory is required", 400));
  }

  if (!product.price || product.price <= 0) {
    return next(new ApiError("Valid product price is required", 400));
  }

  if (!product.quantity || product.quantity < 0) {
    return next(new ApiError("Valid product quantity is required", 400));
  }

  const addedProduct = new ProductModel({
    slug: slugify(product.title),
    ...product,
  });

  await addedProduct.save();

  res.status(201).json({ success: true, data: addedProduct });
});

const getAllProducts = asyncWrapper(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const offset = (page - 1) * limit;

  const products = await ProductModel.find()
    .populate("category", "name")
    .populate("subcategory", "name")
    .skip(offset)
    .limit(limit);

  res.status(200).json({ success: true, page: page, data: { products } });
});

const updateProduct = asyncWrapper(async (req, res, next) => {
  const {
    title,
    price,
    quantity,
    priceAfterDiscount,
    description,
    image,
    category,
    subcategory,
  } = req.body;
  const id = req.params.id;

  if (
    !title &&
    !price &&
    !quantity &&
    !priceAfterDiscount &&
    !description &&
    !image &&
    !category &&
    !subcategory
  ) {
    return next(new ApiError("At least one field is required to update", 400));
  }

  const updateData = {};

  if (title) {
    updateData.title = title;
    updateData.slug = slugify(title);
  }
  if (price !== undefined) updateData.price = price;
  if (quantity !== undefined) updateData.quantity = quantity;
  if (priceAfterDiscount !== undefined)
    updateData.priceAfterDiscount = priceAfterDiscount;
  if (description !== undefined) updateData.description = description;
  if (image !== undefined) updateData.image = image;
  if (category) updateData.category = category;
  if (subcategory) updateData.subcategory = subcategory;

  const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, {
    new: true,
  })
    .populate("category", "name")
    .populate("subcategory", "name");

  if (!updatedProduct) {
    return next(new ApiError("Product not found", 404));
  }

  res.status(200).json({ success: true, data: updatedProduct });
});

const deleteProduct = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next(new ApiError("Invalid id", 400));
  }

  const deletedProduct = await ProductModel.findByIdAndDelete(id);

  if (!deletedProduct) {
    return next(new ApiError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data: deletedProduct,
  });
});

const getSpecificProduct = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next(new ApiError("Invalid id", 400));
  }

  const product = await ProductModel.findById(id)
    .populate("category", "name")
    .populate("subcategory", "name");

  if (!product) {
    return next(new ApiError("Product not found", 404));
  }

  res.status(200).json({ success: true, data: product });
});

const getProductsByCategory = asyncWrapper(async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!categoryId) {
    return next(new ApiError("Category ID is required", 400));
  }

  const offset = (page - 1) * limit;

  const products = await ProductModel.find({ category: categoryId })
    .populate("category", "name")
    .populate("subcategory", "name")
    .skip(offset)
    .limit(limit);

  res.status(200).json({
    success: true,
    page: page,
    data: { products },
  });
});

const getProductsBySubcategory = asyncWrapper(async (req, res, next) => {
  const subcategoryId = req.params.subcategoryId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!subcategoryId) {
    return next(new ApiError("Subcategory ID is required", 400));
  }

  const offset = (page - 1) * limit;

  const products = await ProductModel.find({ subcategory: subcategoryId })
    .populate("category", "name")
    .populate("subcategory", "name")
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
