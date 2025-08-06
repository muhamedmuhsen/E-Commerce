import express from "express";
import {
  login,
  register,
  forgetPassword,
  verifyResetCode,
  resetPassword,
} from "../controllers/auth.controller.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/validateAuthRequest.js";

const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyResetCode", verifyResetCode);
router.put("/resetPassword", resetPassword);

export default router;
