import express from "express";

import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
  getSpecificUser,
  changeUserPassword,
} from "../controllers/user.controller.js";
import {
  createUserValidator,
  deleteUserValidator,
  getUserValidtor,
  updateUserValidator,
  changeUserPasswordValidator,
} from "../validators/validateUserRequest.js";
import authenticateJWT from "../middlewares/authenticateJWT.js";

const router = express.Router();

router
  .route("/")
  .get(getAllUsers)
  .post(createUserValidator, authenticateJWT, createUser);

router.patch(
  "/change-password/:id",
  changeUserPasswordValidator,
  authenticateJWT,
  changeUserPassword
);

router
  .route("/:id")
  .get(getUserValidtor, authenticateJWT, getSpecificUser)
  .put(updateUserValidator, authenticateJWT, updateUser)
  .delete(deleteUserValidator, authenticateJWT, deleteUser);

export default router;
