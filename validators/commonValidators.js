import { body, check } from "express-validator";
import SubCategory from "../models/subcategory.model.js";
import Category from "../models/category.model.js";

const roles = ["user", "admin"];

// MongoDB ID validation with configurable field name
export const mongoId = (fieldName = "id") =>
  check(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} is required`)
    .isMongoId()
    .withMessage(`Invalid ${fieldName}`);

// Name validation with slug generation and configurable length
export const name = (entityName = "Name", minLength = 3, maxLength = 32) =>
  check("name")
    .isLength({ min: minLength, max: maxLength })
    .withMessage(
      `${entityName} name must be between ${minLength} and ${maxLength} characters`
    );

// Category validation with existence check
export const category = (fieldName = "category") =>
  check(fieldName)
    .isMongoId()
    .withMessage(`Invalid ${fieldName} id`)
    .custom(async (value) => {
      const categoryFound = await Category.findById(value).lean();
      if (!categoryFound) {
        throw new Error("Category not found");
      }
      return true;
    });

// Email validation
export const email = (fieldName = "email") =>
  check(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} is required`)
    .isEmail()
    .withMessage(`You must write valid ${fieldName}`);

// Password validation
export const password = (fieldName = "password") =>
  check(fieldName)
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long");

// Password confirmation validation
export const passwordConfirm = (passwordField = "passwordConfirm") =>
  check(passwordField)
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body[passwordField]) {
        throw new Error("Passwords do not match");
      }
      return true;
    });

// Phone validation
export const phone = () =>
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(
      "Invalid phone number - only Egyptian and Saudi numbers accepted"
    );

// Profile image validation
export const profileImage = () => check("profileImg").optional();

// Role validation
export const role = () => check("role").optional().isIn(roles);

// Generic "at least one field" validation
export const atLeastOneField = (fields = []) =>
  body().custom((val) => {
    // Default fields for products if none provided
    const defaultProductFields = [
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
      'address'
    ];

    const fieldsToCheck = fields.length > 0 ? fields : defaultProductFields;

    const hasAtLeastOneField = fieldsToCheck.some(
      (field) => val[field] !== undefined
    );
    if (!hasAtLeastOneField) {
      throw new Error("At least one field is required to update");
    }
    return true;
  });

// Subcategories validation - simplified version
export const subcategories = (isArray = true) => {
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
        const subcategoriesFound = await SubCategory.find({
          _id: { $in: value },
        }).lean();

        if (subcategoriesFound.length !== value.length) {
          throw new Error("One or more subcategories not found");
        }

        // Check if all subcategories belong to the specified category
        const parentCategory = req.body.category;
        const invalidSubcategories = subcategoriesFound.filter(
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

export const brand = () =>
  check("brand").optional().isMongoId().withMessage("Invalid brand id");

export const ratingsQuantity = () =>
  check("ratingsQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Ratings quantity must be a positive number");

export const description = () =>
  check("description")
    .isLength({ min: 20, max: 2000 })
    .withMessage("Product description must be between 20 and 2000 characters");
export const quantity = () =>
  check("quantity")
    .isInt({ min: 0 })
    .withMessage("Product quantity must be a positive number");

export const sold = () =>
  check("sold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Product sold must be a positive number");

export const price = () =>
  check("price")
    .isFloat({ min: 0 })
    .withMessage("Product price must be a positive number");

export const priceAfterDiscount = () =>
  check("priceAfterDiscount")
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
    });

export const colors = () => check("colors").optional().isArray();

export const imageCover = () =>
  check("imageCover").notEmpty().withMessage("Product image cover is required");

export const images = () =>
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images should be array of strings");

export const ratingsAverage = () =>
  check("ratingsAverage")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1.0 and 5.0");
