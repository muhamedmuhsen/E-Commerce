import express from "express";
import allowed from "../middlewares/isAllowed.js";
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
  deactivate,
} from "../controllers/user.controller.js";
import {
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} from "../validators/validateUserRequest.js";
import authenticateJWT from "../middlewares/authenticateJWT.js";

const router = express.Router();

router.use(authenticateJWT);

router.get("/get-me", getLoggedUser, getUser);
router.delete("/deactivate-me", getLoggedUser, deactivate);

// TODO(fix validation)
router.put(
  "/update-me",
  updateLoggedUserValidator,
  getLoggedUser,
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
  .get(getUserValidator, getUser)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

export default router;
