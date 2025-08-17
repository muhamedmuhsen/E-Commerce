import validateRequest from "../middlewares/validateRequest.js";
import User from "../models/user.model.js";
import {
  email,
  mongoId,
  password,
  passwordConfirm,
  role,
  phone,
  profileImage,
  atLeastOneField,
  name,
} from "./commonValidators.js";

const checkIfEmailFoundForUpdate = async (email, { req }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser._id.toString() !== req.params.id) {
    throw new Error("Email already exists");
  }
  return true;
};

const createUserValidator = [
  name("username").notEmpty().withMessage("username is requried"),
  email(),
  password(),
  passwordConfirm(),
  phone(),
  profileImage(),
  role(),
  validateRequest,
];

const getUserValidator = [mongoId(), validateRequest];

const updateUserValidator = [
  mongoId(),
  atLeastOneField,
  name("username").optional(),
  email()
    .custom(checkIfEmailFoundForUpdate)
    .withMessage("please try another mail"),
  phone(),
  profileImage(),
  role(),
  validateRequest,
];

const updateLoggedUserValidator = [
  atLeastOneField(["name", "email", "profileImg"]),
  name("username"),
  email()
    .optional()
    .custom(checkIfEmailFoundForUpdate)
    .withMessage("please try another mail"),
  phone(),
  profileImage(),
  validateRequest,
];
const deleteUserValidator = [mongoId(), validateRequest];

const changeUserPasswordValidator = [
  mongoId(),
  password(),
  password("newPassword"),
  passwordConfirm("confirmNewPassword"),
  validateRequest,
];

export {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
};
