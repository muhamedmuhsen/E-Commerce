import express from "express";

import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
  getUser,
  changeUserPassword,
  getLoggedUser,
  allowed,
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

router.use(authenticateJWT);

router.get("/getMe", getLoggedUser, getUser);

// Protected Routes
router.use(allowed("admin", "manager"));

router.route("/").get(getAllUsers).post(createUserValidator, createUser);

router.patch(
  "/change-password/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

router
  .route("/:id")
  .get(getUserValidtor, getUser)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

export default router;
