import { check, body } from "express-validator";
import slugify from "slugify";

// Common ID validation
export const mongoIdValidator = (fieldName = "id", message = null) =>
  check(fieldName)
    .isMongoId()
    .withMessage(message || `Invalid ${fieldName}`);

// Common name validation with configurable length
export const nameValidator = (
  fieldName = "name",
  minLength = 3,
  maxLength = 32
) =>
  check(fieldName)
    .isLength({ min: minLength, max: maxLength })
    .withMessage(
      `${fieldName} must be between ${minLength} and ${maxLength} characters`
    )
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    });

// Email validation
export const emailValidator = check("email")
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("You must write valid email");

// Password validation
export const passwordValidator = check("password")
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long");

// Password confirmation validation
export const passwordConfirmValidator = check("passwordConfirm")
  .notEmpty()
  .withMessage("Password confirmation is required")
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  });

// Common numeric validation
export const numericValidator = (fieldName, min = 0, message = null) =>
  check(fieldName)
    .isNumeric()
    .withMessage(message || `${fieldName} must be a number`)
    .isFloat({ min })
    .withMessage(message || `${fieldName} must be at least ${min}`);

// Common integer validation
export const integerValidator = (fieldName, min = 0, message = null) =>
  check(fieldName)
    .isInt({ min })
    .withMessage(message || `${fieldName} must be a positive integer`);

// Common array validation
export const arrayValidator = (fieldName, message = null) =>
  check(fieldName)
    .optional()
    .isArray()
    .withMessage(message || `${fieldName} should be an array`);

// Common string length validation
export const stringLengthValidator = (
  fieldName,
  minLength,
  maxLength,
  message = null
) =>
  check(fieldName)
    .isLength({ min: minLength, max: maxLength })
    .withMessage(
      message ||
        `${fieldName} must be between ${minLength} and ${maxLength} characters`
    );

// Common phone validation
export const phoneValidator = check("phone")
  .optional()
  .isMobilePhone(["ar-EG", "ar-SA"])
  .withMessage("Invalid phone number only accepted Egy and SA Phone numbers");

// Common role validation
export const roleValidator = (allowedRoles = ["user", "admin"]) =>
  check("role")
    .optional()
    .isIn(allowedRoles)
    .withMessage(`Role must be one of: ${allowedRoles.join(", ")}`);

// Common "at least one field" validation
export const atLeastOneFieldValidator = (fields) =>
  body().custom((val) => {
    const hasAtLeastOneField = fields.some((field) => val[field] !== undefined);
    if (!hasAtLeastOneField) {
      throw new Error("At least one field is required to update");
    }
    return true;
  });

// Email uniqueness validation
export const emailExistsValidator = (Model, excludeCurrentUser = false) =>
  check("email").custom(async (email, { req }) => {
    const query = { email };
    const existingUser = await Model.findOne(query);

    if (existingUser) {
      if (excludeCurrentUser && req.params.id) {
        if (existingUser._id.toString() !== req.params.id) {
          throw new Error("Email already exists");
        }
      } else {
        throw new Error("Email already exists");
      }
    }
    return true;
  });
