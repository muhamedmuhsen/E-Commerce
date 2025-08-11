import { check } from "express-validator";
import validateRequest from "../middlewares/validateRequest.js";
import Category from "../models/category.model.js";
import SubCategory from "../models/subcategory.model.js";
import {
  mongoIdValidator,
  nameValidator,
  stringLengthValidator,
  numericValidator,
  integerValidator,
  arrayValidator,
  atLeastOneFieldValidator,
} from "./commonValidators.js";

// Product-specific validation rules
const productValidationRules = {
  name: nameValidator("name", 3, 100),

  description: stringLengthValidator(
    "description",
    20,
    2000,
    "Product description must be between 20 and 2000 characters"
  ),

  quantity: integerValidator(
    "quantity",
    0,
    "Product quantity must be a positive number"
  ),

  sold: integerValidator(
    "sold",
    0,
    "Product sold must be a positive number"
  ).optional(),

  price: numericValidator(
    "price",
    0,
    "Product price must be a positive number"
  ),

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

  colors: arrayValidator(
    "colors",
    "Available colors should be array of strings"
  ),

  imageCover: check("imageCover")
    .notEmpty()
    .withMessage("Product image cover is required"),

  images: arrayValidator("images", "Product images should be array of strings"),

  category: mongoIdValidator("category", "Invalid category id").custom(
    async (value) => {
      const category = await Category.findById(value).lean();
      if (!category) {
        throw new Error("Category not found");
      }
      return true;
    }
  ),

  ratingsAverage: check("ratingsAverage")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1.0 and 5.0"),

  ratingsQuantity: integerValidator(
    "ratingsQuantity",
    0,
    "Ratings quantity must be a positive number"
  ).optional(),

  brand: mongoIdValidator("brand", "Invalid brand id").optional(),

  id: mongoIdValidator("id", "Invalid product id")
    .notEmpty()
    .withMessage("Product id is required"),
};

// Subcategories validation for create/update
const validateSubcategories = (isArray = true) => {
  const baseValidation = check("subcategories").optional();

  if (isArray) {
    return baseValidation
      .isArray()
      .withMessage("Subcategories should be an array")
      .custom(async (value, { req }) => {
        if (!value || value.length === 0) return true;

        // Check if category is provided
        if (!req.body.category) {
          throw new Error(
            "Category is required when subcategories are provided"
          );
        }

        // Check if all subcategories exist
        const subcategories = await SubCategory.find({
          _id: { $in: value },
        }).lean();

        if (subcategories.length !== value.length) {
          throw new Error("One or more subcategories not found");
        }

        // Check if all subcategories belong to the specified category
        const parentCategory = req.body.category;
        const invalidSubcategories = subcategories.filter(
          (sub) => sub.category.toString() !== parentCategory.toString()
        );

        if (invalidSubcategories.length > 0) {
          throw new Error(
            "All subcategories must belong to the specified category"
          );
        }

        return true;
      });
  }

  // For single subcategory (update validator)
  return baseValidation
    .isMongoId()
    .withMessage("Invalid subcategory id")
    .custom(async (value) => {
      const subcategory = await SubCategory.findById(value).lean();
      if (!subcategory) {
        throw new Error("Subcategory not found");
      }
      return true;
    });
};

// Product update fields for "at least one field" validation
const productUpdateFields = [
  "name",
  "description",
  "quantity",
  "sold",
  "price",
  "priceAfterDiscount",
  "colors",
  "imageCover",
  "images",
  "category",
  "subcategories",
  "brand",
  "ratingsAverage",
  "ratingsQuantity",
];

// Create product validator
const createProductValidator = [
  productValidationRules.name
    .notEmpty()
    .withMessage("Product name is required"),
  productValidationRules.description
    .notEmpty()
    .withMessage("Product description is required"),
  productValidationRules.quantity
    .notEmpty()
    .withMessage("Product quantity is required"),
  productValidationRules.sold,
  productValidationRules.price
    .notEmpty()
    .withMessage("Product price is required"),
  productValidationRules.priceAfterDiscount,
  productValidationRules.colors,
  productValidationRules.imageCover,
  productValidationRules.images,
  productValidationRules.category
    .notEmpty()
    .withMessage("Product must belong to a category"),
  productValidationRules.ratingsAverage,
  productValidationRules.ratingsQuantity,
  validateSubcategories(true),
  validateRequest,
];

// Update product validator
const updateProductValidator = [
  productValidationRules.id,

  // Make all fields optional for updates
  productValidationRules.name.optional(),
  productValidationRules.description.optional(),
  productValidationRules.quantity.optional(),
  productValidationRules.sold,
  productValidationRules.price.optional(),
  productValidationRules.priceAfterDiscount.custom((value, { req }) => {
    if (value && req.body.price && value >= req.body.price) {
      throw new Error("Price after discount must be lower than original price");
    }
    return true;
  }),
  productValidationRules.colors,

  check("imageCover")
    .optional()
    .notEmpty()
    .withMessage("Product image cover cannot be empty"),

  productValidationRules.images,
  productValidationRules.category.optional(),
  validateSubcategories(false), // Single subcategory for updates
  productValidationRules.brand,
  productValidationRules.ratingsAverage,
  productValidationRules.ratingsQuantity,

  // Ensure at least one field is provided for update
  atLeastOneFieldValidator(productUpdateFields),

  validateRequest,
];

// Get specific product validator
const getSpecificProductValidator = [
  mongoIdValidator("id", "Invalid product id"),
  validateRequest,
];

// Delete product validator (reuse get validator)
const deleteProductValidator = getSpecificProductValidator;

export {
  createProductValidator,
  deleteProductValidator,
  getSpecificProductValidator,
  updateProductValidator,
};
