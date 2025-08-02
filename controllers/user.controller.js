import User from "../models/user.model.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
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
const changeUserPassword = asyncWrapper(async (req, res, next) => {
  const updatedPassword = req.body.newPassword;

  const hashedPassword = await bcrypt.hash(updatedPassword, 10);

  const updatedDocument = await User.findByIdAndUpdate(
    req.params.id,
    { password: hashedPassword, passwordChangeAt: Date.now() },
    { new: true }
  );
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(200).json({ success: true, data: updatedDocument, token });
});

/*
    @desc   Get logged user data
    @route  GET /api/v1/users/getMe
    @access Private/Protect
*/
const getLoggedUser = asyncWrapper(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

const updateLoggedUserPassword = asyncWrapper(async (req, res, next) => {
  const updatedPassword = req.body.newPassword;

  const hashedPassword = await bcrypt.hash(updatedPassword, 10);

  const updatedDocument = await User.findByIdAndUpdate(
    req.user._id,
    { password: hashedPassword, passwordChangeAt: Date.now() },
    { new: true }
  );

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

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

const allowed = (...roles) => {
  return asyncWrapper(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });
};

export {
  createUser,
  updateUser,
  getAllUsers,
  deleteUser,
  getUser,
  changeUserPassword,
  getLoggedUser,
  allowed,
  updateLoggedUserPassword,
  updateLoggedUserData,
};
