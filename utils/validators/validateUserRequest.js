import { body, check } from "express-validator";
import validateRequest from "../../middlewares/validateRequest.js";
import User from "../../models/user.model.js";
import slugify from "slugify";

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

const checkIfEmailFound = async (val) => {
  const user = await User.findOne({ email: val });
  if (!user) {
    throw new Error("Email not found");
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
    .withMessage("username is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("Brand name must be between 3 and 32 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  email: check("email")
    .withMessage("email is required")
    .isEmail()
    .withMessage("please enter valid mail"),

  password: check("password")
    .withMessage("username is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  confirmPassword: check("passwordConfirm")
    .withMessage("Password confirmation required")
    .custom(checkIfPasswordMatches),

  phone: check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  profileImage: check("profileImg").optional(),

  role: check("role").optional().isIn(roles),
};

const createUserValidator = [
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
    .custom(checkIfEmailFound)
    .withMessage("please try another mail"),
  commonRules.password.optional(),
  commonRules.confirmPassword.optional(),
  commonRules.phone,
  commonRules.profileImage,
  commonRules.role,
  validateRequest,
];

const deleteUserValidator = [commonRules.id, validateRequest];

export {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getUserValidtor,
};
