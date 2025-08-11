import { check } from "express-validator";
import validateRequest from "../middlewares/validateRequest.js";
import User from "../models/user.model.js";
import {
  mongoIdValidator,
  nameValidator,
  emailValidator,
  passwordValidator,
  phoneValidator,
  roleValidator,
  atLeastOneFieldValidator,
  emailExistsValidator,
} from "./commonValidators.js";

const userUpdateFields = [
  "name",
  "email",
  "password",
  "phone",
  "role",
  "profileImg",
];

const commonRules = {
  id: mongoIdValidator("id", "Invalid mongoDB id")
    .notEmpty()
    .withMessage("id is required"),

  name: nameValidator("name", 3, 32),

  email: emailValidator,

  password: passwordValidator,

  confirmPassword: check("confirmPassword").custom((val, { req }) => {
    if (val !== req.body.password) {
      throw new Error(`passwords don't match`);
    }
    return true;
  }),

  phone: phoneValidator,

  profileImage: check("profileImg").optional(),

  role: roleValidator(["user", "admin"]),

  emailExists: emailExistsValidator(User, false),

  emailExistsForUpdate: emailExistsValidator(User, true),

  hasAtLeastOneField: atLeastOneFieldValidator(userUpdateFields),
};

const createUserValidator = [
  commonRules.name.notEmpty().withMessage("username is required"),
  commonRules.email.notEmpty().withMessage("email is required"),
  commonRules.emailExists,
  commonRules.password.notEmpty().withMessage("password is required"),
  commonRules.confirmPassword
    .notEmpty()
    .withMessage("confirm password field is required"),
  commonRules.phone,
  commonRules.profileImage,
  commonRules.role,
  validateRequest,
];

const getUserValidtor = [commonRules.id, validateRequest];

const updateUserValidator = [
  commonRules.id,
  commonRules.hasAtLeastOneField,
  commonRules.name.optional(),
  commonRules.email.optional(),
  commonRules.emailExistsForUpdate,
  commonRules.password.optional(),
  commonRules.confirmPassword.optional(),
  commonRules.phone,
  commonRules.profileImage,
  commonRules.role,
  validateRequest,
];

const updateLoggedUserValidator = [
  commonRules.hasAtLeastOneField,
  commonRules.name.optional(),
  commonRules.email.optional(),
  commonRules.emailExistsForUpdate,
  commonRules.phone,
  commonRules.profileImage,
  validateRequest,
];

const deleteUserValidator = [commonRules.id, validateRequest];

const changeUserPasswordValidator = [
  commonRules.id,

  passwordValidator.withMessage("Current password is required"),

  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long"),

  check("confirmNewPassword")
    .notEmpty()
    .withMessage("Confirm new password is required")
    .custom((val, { req }) => {
      if (val !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  validateRequest,
];

export {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getUserValidtor,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
};
