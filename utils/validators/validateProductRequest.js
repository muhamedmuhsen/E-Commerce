import { body, check } from "express-validator";
import validateRequest from "../../middlewares/validateRequest.js";
import Category from "../../models/category.model.js";
import SubCategory from "../../models/subcategory.model.js";

// Common validation rules
const commonValidationRules = {
  title: check("title")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product title must be between 3 and 100 characters"),

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

  category: check("category")
    .isMongoId()
    .withMessage("Invalid category id")
    .custom(async (value) => {
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
  } else {
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
  }
};

// Create product validator
const createProductValidator = [
  commonValidationRules.title
    .notEmpty()
    .withMessage("Product title is required"),
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
  validateSubcategories(true),
  validateRequest,
];

// Update product validator
const updateProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Product id is required")
    .isMongoId()
    .withMessage("Invalid product id"),

  // Make all fields optional for updates
  commonValidationRules.title.optional(),
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
  validateSubcategories(false), // Single subcategory for updates
  commonValidationRules.brand,
  commonValidationRules.ratingsAverage,
  commonValidationRules.ratingsQuantity,

  // Ensure at least one field is provided for update
  body().custom((value) => {
    const updateFields = [
      "title",
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

    const hasAtLeastOneField = updateFields.some(
      (field) => value[field] !== undefined
    );

    if (!hasAtLeastOneField) {
      throw new Error("At least one field is required to update");
    }
    return true;
  }),

  validateRequest,
];

// Get specific product validator
const getSpecificProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id"),
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
