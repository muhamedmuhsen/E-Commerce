import express from "express";

import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
  getSpecificUser,
} from "../controllers/user.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
// import validateUserRole from "../middlewares/validateUserRole.js";

const router = express.Router();

router
  .route("/")
  .get(verifyToken, getAllUsers)
  .post(verifyToken, createUser);

router
  .route("/:id")
  .get(verifyToken, getSpecificUser)
  .put(verifyToken, updateUser)
  .delete(verifyToken, deleteUser);

export default router;
