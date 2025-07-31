import express from "express";
import {
  login,
  register,
  forgetPassword,
  verifyResetCode,
  // resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyResetCode", verifyResetCode);
//router.post("/resetPassword", resetPassword);

export default router;
