import User from "../models/user.model.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlersFactory.js";

// TODO(handle profile image)

/*
    @desc   Get specific user by ID
    @route  GET /api/v1/users/:id
    @access Private
*/
const getSpecificUser = getOne(User);

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

export { createUser, updateUser, getAllUsers, deleteUser, getSpecificUser };
