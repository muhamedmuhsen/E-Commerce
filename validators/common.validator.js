import { body, check } from "express-validator";
import SubCategory from "../models/sub-category.model.js";
import Category from "../models/category.model.js";
import { BadRequestError } from "../utils/api-errors.js";

const roles = ["user", "admin"];

export const mongoId = (fieldName = "id") =>
  check(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} is required`)
    .isMongoId()
    .withMessage(`Invalid ${fieldName}`);

export const name = (entityName = "name", minLength = 3, maxLength = 32) =>
  check("name")
    .isLength({ min: minLength, max: maxLength })
    .withMessage(
      `${entityName} name must be between ${minLength} and ${maxLength} characters`
    );

export const category = (fieldName = "category") =>
  check(fieldName).isMongoId().withMessage(`Invalid ${fieldName} id`);

export const email = () =>
  check("email")
    .notEmpty()
    .withMessage(`Email is required`)
    .isEmail()
    .withMessage(`You must write valid Email`);

export const password = (fieldName = "password") =>
  check(fieldName)
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long");

export const passwordConfirm = (passwordField = "passwordConfirm") =>
  check(passwordField)
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body[passwordField]) {
        throw new BadRequestError("Passwords do not match");
      }
      return true;
    });

export const phone = () =>
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(
      "Invalid phone number - only Egyptian and Saudi numbers accepted"
    );

export const profileImage = () => check("profileImg").optional().isURL();

export const role = () => check("role").optional().isIn(roles);

export const atLeastOneField = (fields = [], image) =>
  body().custom((val) => {
    const defaultProductFields = [
      "name",
      "description",
      "price",
      "colors",
      "imageCover",
      "images",
      "category",
      "subcategories",
      "brand",
    ];

    const fieldsToCheck = fields.length > 0 ? fields : defaultProductFields;
    const hasAtLeastOneField = fieldsToCheck.some(
      (field) => val[field] !== undefined
    );

    if (!hasAtLeastOneField)
      throw new BadRequestError("At least one field is required to update");

    return true;
  });

export const subcategories = () =>
  check("subcategories")
    .isArray({ min: 1 })
    .withMessage("SubCategories must by an array and with min length 1");

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
