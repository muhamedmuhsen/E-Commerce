import express from "express";

import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
  getSpecificUser,
} from "../controllers/user.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import {
  createUserValidator,
  deleteUserValidator,
  getUserValidtor,
  updateUserValidator,
} from "../utils/validators/validateUserRequest.js";
// import validateUserRole from "../middlewares/validateUserRole.js";

const router = express.Router();

router.route("/").get(getAllUsers).post(createUserValidator, createUser);

router
  .route("/:id")
  .get(getUserValidtor, getSpecificUser)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

export default router;
