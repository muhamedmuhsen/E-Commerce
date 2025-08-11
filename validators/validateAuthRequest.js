import { check } from "express-validator";
import validateRequest from "../middlewares/validateRequest.js";
import {
  emailValidator,
  passwordValidator,
  passwordConfirmValidator,
  nameValidator,
} from "./commonValidators.js";
import User from "../models/user.model.js";

// Check if email already exists
const checkEmailExists = check("email").custom(async (email) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already exists");
  }
  return true;
});

const registerValidator = [
  nameValidator("name"),
  emailValidator,
  checkEmailExists,
  passwordValidator,
  passwordConfirmValidator,
  validateRequest,
];

const loginValidator = [emailValidator, passwordValidator, validateRequest];

// Add missing validators for other auth routes
const forgetPasswordValidator = [emailValidator, validateRequest];

const verifyResetCodeValidator = [
  check("resetCode")
    .notEmpty()
    .withMessage("Reset code is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Reset code must be 6 digits")
    .isNumeric()
    .withMessage("Reset code must be numeric"),
  validateRequest,
];

const resetPasswordValidator = [
  passwordValidator,
  passwordConfirmValidator,
  validateRequest,
];

export {
  registerValidator,
  loginValidator,
  forgetPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
};
