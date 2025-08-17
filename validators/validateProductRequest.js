import { body, check } from "express-validator";
import validateRequest from "../middlewares/validateRequest.js";
import Category from "../models/category.model.js";
import {
  atLeastOneField,
  mongoId,
  subcategories,
  name,
} from "./commonValidators.js";

// Common validation rules
const commonValidationRules = {
  description: check("description")
    .isLength({ min: 20, max: 2000 })
    .withMessage("Product description must be between 20 and 2000 characters"),

  quantity: check("quantity")
    .isInt({ min: 0 })
    .withMessage("Product quantity must be a positive number"),

  sold: check("sold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Product sold must be a positive number"),

  price: check("price")
    .isFloat({ min: 0 })
    .withMessage("Product price must be a positive number"),

  priceAfterDiscount: check("priceAfterDiscount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Product price after discount must be a positive number")
    .custom((value, { req }) => {
      if (value && value >= req.body.price) {
        throw new Error(
          "Price after discount must be lower than original price"
        );
      }
      return true;
    }),

  colors: check("colors")
    .optional()
    .isArray()
    .withMessage("Available colors should be array of strings"),

  imageCover: check("imageCover")
    .notEmpty()
    .withMessage("Product image cover is required"),

  images: check("images")
    .optional()
    .isArray()
    .withMessage("Product images should be array of strings"),

  category: mongoId("category").custom(async (value) => {
    const category = await Category.findById(value).lean();
    if (!category) {
      throw new Error("Category not found");
    }
    return true;
  }),

  ratingsAverage: check("ratingsAverage")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1.0 and 5.0"),

  ratingsQuantity: check("ratingsQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Ratings quantity must be a positive number"),

  brand: check("brand").optional().isMongoId().withMessage("Invalid brand id"),
};

// Subcategories validation for create/update

// Create product validator
const createProductValidator = [
  name("Product").notEmpty().withMessage("Product name is required"),
  commonValidationRules.description
    .notEmpty()
    .withMessage("Product description is required"),
  commonValidationRules.quantity
    .notEmpty()
    .withMessage("Product quantity is required"),
  commonValidationRules.sold,
  commonValidationRules.price
    .notEmpty()
    .withMessage("Product price is required"),
  commonValidationRules.priceAfterDiscount,
  commonValidationRules.colors,
  commonValidationRules.imageCover,
  commonValidationRules.images,
  commonValidationRules.category
    .notEmpty()
    .withMessage("Product must belong to a category"),
  commonValidationRules.ratingsAverage,
  commonValidationRules.ratingsQuantity,
  subcategories,
  validateRequest,
];

// Update product validator
const updateProductValidator = [
  mongoId,

  // Make all fields optional for updates
  name("Product").optional(),
  commonValidationRules.description.optional(),
  commonValidationRules.quantity.optional(),
  commonValidationRules.sold,
  commonValidationRules.price.optional(),
  commonValidationRules.priceAfterDiscount.custom((value, { req }) => {
    if (value && req.body.price && value >= req.body.price) {
      throw new Error("Price after discount must be lower than original price");
    }
    return true;
  }),
  commonValidationRules.colors,

  check("imageCover")
    .optional()
    .notEmpty()
    .withMessage("Product image cover cannot be empty"),

  commonValidationRules.images,
  commonValidationRules.category.optional(),
  subcategories(false), // Single subcategory for updates
  commonValidationRules.brand,
  commonValidationRules.ratingsAverage,
  commonValidationRules.ratingsQuantity,

  // Ensure at least one field is provided for update
  atLeastOneField,

  validateRequest,
];

// Get specific product validator
const getSpecificProductValidator = [mongoId, validateRequest];

// Delete product validator (reuse get validator)
const deleteProductValidator = getSpecificProductValidator;

export {
  createProductValidator,
  deleteProductValidator,
  getSpecificProductValidator,
  updateProductValidator,
};
