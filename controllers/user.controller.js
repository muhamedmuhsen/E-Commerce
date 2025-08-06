import User from "../models/user.model.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import createToken from "../utils/createToken.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlersFactory.js";
import bcrypt from "bcryptjs";

// TODO(handle profile image)

/*
    @desc   Get specific user by ID
    @route  GET /api/v1/users/:id
    @access Private
*/
const getUser = getOne(User);

/*
    @desc   Create new user
    @route  POST /api/v1/users
    @access Private
*/
const createUser = createOne(User);

/*
    @desc   Update user by ID
    @route  PUT/PATCH /api/v1/users/:id
    @access Private
*/
const updateUser = updateOne(User);

/*
    @desc   Get all users
    @route  GET /api/v1/users
    @access Private
*/
const getAllUsers = getAll(User);

/*
    @desc   Delete user by ID
    @route  DELETE /api/v1/users/:id
    @access Private
*/
const deleteUser = deleteOne(User);

/*
    @desc   Change user password by ID
    @route  PUT/PATCH /api/v1/users/:id/changePassword
    @access Private
*/

/*
    @desc   Get logged user data
    @route  GET /api/v1/users/getMe
    @access Private/Protect
*/
const getLoggedUser = asyncWrapper(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

const changeUserPassword = asyncWrapper(async (req, res, next) => {
  const updatedPassword = req.body.newPassword;

  const hashedPassword = await bcrypt.hash(updatedPassword, 10);

  const updatedDocument = await User.findByIdAndUpdate(
    req.params.id,
    { password: hashedPassword, passwordChangeAt: Date.now() },
    { new: true }
  );
  const token = createToken(updatedDocument._id);
  res.status(200).json({ success: true, data: updatedDocument, token });
});

const updateLoggedUserPassword = asyncWrapper(async (req, res, next) => {
  const updatedPassword = req.body.newPassword;

  const hashedPassword = await bcrypt.hash(updatedPassword, 10);

  const updatedDocument = await User.findByIdAndUpdate(
    req.user._id,
    { password: hashedPassword, passwordChangeAt: Date.now() },
    { new: true }
  );

  const token = createToken(updatedDocument._id);

  res.status(200).json({ success: true, data: updatedDocument, token });
});

const updateLoggedUserData = asyncWrapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, email: req.body.email, phone: req.body.phone },
    { new: true }
  );

  res.status(200).json({ success: true, data: user });
});

const deactivate = asyncWrapper(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      isActive: false,
    },
    { new: true }
  );
  res
    .status(200)
    .json({ success: true, message: "account deactivated successuflly." });
});

export {
  createUser,
  updateUser,
  getAllUsers,
  deleteUser,
  getUser,
  changeUserPassword,
  getLoggedUser,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deactivate,
};
