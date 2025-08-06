import { check } from "express-validator";
import validateRequest from "../middlewares/validateRequest.js";
import slugify from "slugify";
import User from "../models/user.model.js";

const registerValidator = [
  check("name")
    .isLength({ min: 3, max: 32 })
    .withMessage("Username must be between 3 and 32 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("you must write valid mail")
    .custom(async (val, { req }) => {
      const existingUser = await User.findOne({ email: val });

      if (existingUser) {
        throw new Error("User already exists");
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Confirm new password is required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new UnauthorizedError("Passwords do not match");
      }
      return true;
    }),
  validateRequest,
];

const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("you must write valid mail")
    .custom(async (val, { req }) => {
      const existingUser = await User.findOne({ email: val });

      if (!existingUser) {
        throw new Error("email not found");
      }
    }),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: req.body.email });

      if (!(await bcrypt.compare(val, user.password))) {
        throw new Error("Invalid credentials");
      }
    }),
];

export { registerValidator, loginValidator };
