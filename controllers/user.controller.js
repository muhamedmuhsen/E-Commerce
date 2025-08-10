import User from '../models/user.model.js';
import asyncWrapper from '../middlewares/asyncWrapper.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlersFactory.js';
import bcrypt from 'bcryptjs';
import {
  changeUserPasswordService,
  updateLoggedUserDataService,
  deactivateService,
} from '../services/user.service.js';
import {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from '../utils/ApiErrors.js';

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
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new NotFoundError('User not found'));
  }

  const isMatchedPassword = await bcrypt.compare(val, user.password);
  if (!isMatchedPassword) {
    return next(new UnauthorizedError('Current password is incorrect'));
  }

  const token = await changeUserPasswordService(user._id, req.body.newPassword);

  res
    .status(200)
    .json({ success: true, message: 'Password changed successfully', token });
});

const updateLoggedUserPassword = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new NotFoundError('User not found'));
  }

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return next(new UnauthorizedError('Current password is incorrect'));
  }

  const token = await changeUserPasswordService(user._id, req.body.newPassword);

  res
    .status(200)
    .json({ success: true, message: 'Password changed successfully', token });
});

const updateLoggedUserData = asyncWrapper(async (req, res, next) => {
  const user = await updateLoggedUserDataService(req.user._id, req.body);

  if (!user) {
    return next(new NotFoundError('User not found'));
  }

  res
    .status(200)
    .json({ success: true, message: 'user updated successfully', data: user });
});

const deactivate = asyncWrapper(async (req, res, next) => {
  const user = await deactivateService(req.user._id);

  if (!user) {
    return next(new NotFoundError('User not found'));
  }
  res
    .status(200)
    .json({ success: true, message: 'Account deactivated successuflly.' });
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
