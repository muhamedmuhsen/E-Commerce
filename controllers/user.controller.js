import User from "../models/user.model.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlersFactory.js";

const getSpecificUser = getOne(User);

const createUser = createOne(User);

const updateUser = updateOne(User);

const getAllUsers = getAll(User);

const deleteUser = deleteOne(User);

export { createUser, updateUser, getAllUsers, deleteUser, getSpecificUser };
