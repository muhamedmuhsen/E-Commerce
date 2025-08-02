import express from "express";

import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
  getUser,
  changeUserPassword,
  getLoggedUser,
  updateLoggedUserPassword,
  updateLoggedUserData,
  allowed,
} from "../controllers/user.controller.js";
import {
  createUserValidator,
  deleteUserValidator,
  getUserValidtor,
  updateUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} from "../validators/validateUserRequest.js";
import authenticateJWT from "../middlewares/authenticateJWT.js";

const router = express.Router();

router.use(authenticateJWT);

router.get("/getMe", getLoggedUser, getUser);
router.put(
  "/update-me",
  getLoggedUser,
  updateLoggedUserValidator,
  updateLoggedUserData
);
router.patch(
  "/update-my-password",
  getLoggedUser,
  changeUserPasswordValidator,
  updateLoggedUserPassword
);

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
