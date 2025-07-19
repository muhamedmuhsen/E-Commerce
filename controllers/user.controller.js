import asyncWrapper from "../middlewares/asyncWrapper.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

const getSpecificUser = asyncWrapper(async (req, res, next) => {});

const createUser = asyncWrapper(async (req, res, next) => {
  const user = req.body;

  if (!user) {
    return next(new ApiError("all fields are required", 400));
  }



  const addUser = new User({

  });

  await addUser.save();

  res.status(201).json({ success: true, data: addUser });
});

const updateUser = asyncWrapper(async (req, res, next) => {});

const getAllUsers = asyncWrapper(async (req, res, next) => {});

const deleteUser = asyncWrapper(async (req, res, next) => {});

export { createUser, updateUser, getAllUsers, deleteUser, getSpecificUser };
