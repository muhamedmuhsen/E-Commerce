import { body, check } from "express-validator";
import validateRequest from "../middlewares/validateRequest.js";
import User from "../models/user.model.js";
import slugify from "slugify";
import bcrypt from "bcryptjs";

const roles = ["user", "admin"];

const hasAtLeastOneField = body().custom((val) => {
  const updateFields = [
    "name",
    "email",
    "password",
    "phone",
    "role",
    "profileImg",
  ];
  const hasAtLeastOneField = updateFields.some(
    (field) => val[field] !== undefined
  );
  if (!hasAtLeastOneField) {
    throw new Error("At least one field is required to update");
  }
  return true;
});

const checkIfPasswordMatches = (val, { req }) => {
  if (val !== req.body.password) {
    throw new Error(`passwords don't match`);
  }
  return true;
};

const checkIfEmailFound = async (email) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already exists");
  }
  return true;
};

const checkIfEmailFoundForUpdate = async (email, { req }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser._id.toString() !== req.params.id) {
    throw new Error("Email already exists");
  }
  return true;
};

const commonRules = {
  id: check("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("Invalid mongoDB id"),

  name: check("name")
    .isLength({ min: 3, max: 32 })
    .withMessage("Username must be between 3 and 32 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  email: check("email").isEmail().withMessage("please enter valid mail"),

  password: check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  confirmPassword: check("confirmPassword").custom(checkIfPasswordMatches),

  phone: check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  profileImage: check("profileImg").optional(),

  role: check("role").optional().isIn(roles),
};

const createUserValidator = [
  (req, res, next) => {
    next();
  },
  commonRules.name.notEmpty().withMessage("username is requried"),
  commonRules.email
    .notEmpty()
    .withMessage("email is requried")
    .custom(checkIfEmailFound)
    .withMessage("please try another mail"),
  commonRules.password.notEmpty().withMessage("password is requried"),
  commonRules.confirmPassword
    .notEmpty()
    .withMessage("confirm password field is requried"),
  commonRules.phone,
  commonRules.profileImage,
  commonRules.role,
  validateRequest,
];

const getUserValidtor = [commonRules.id, validateRequest];

const updateUserValidator = [
  commonRules.id,
  hasAtLeastOneField,
  commonRules.name.optional(),
  commonRules.email
    .optional()
    .custom(checkIfEmailFoundForUpdate)
    .withMessage("please try another mail"),
  commonRules.password.optional(),
  commonRules.confirmPassword.optional(),
  commonRules.phone,
  commonRules.profileImage,
  commonRules.role,
  validateRequest,
];

const updateLoggedUserValidator = [
  hasAtLeastOneField,
  commonRules.name.optional(),
  commonRules.email
    .optional()
    .custom(checkIfEmailFoundForUpdate)
    .withMessage("please try another mail")
  ,commonRules.phone,
  commonRules.profileImage,
  validateRequest,
];
const deleteUserValidator = [commonRules.id, validateRequest];

const changeUserPasswordValidator = [

  commonRules.id,

  check("password")
    .notEmpty()
    .withMessage("Current password is required")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);

      if (!user) {
        throw new Error("User not found");
      }

      if (!user.password) {
        throw new Error("User has no password set");
      }

      const isMatchedPassword = await bcrypt.compare(val, user.password);
      if (!isMatchedPassword) {
        throw new Error("Current password is incorrect");
      }
      return true;
    }),

  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

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
