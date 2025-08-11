import express from "express";
import {
  loginSController as login,
  registerController as register,
  forgetPasswordController as forgetPassword,
  verifyResetCodeController as verifyResetCode,
  resetPasswordController as resetPassword,
} from "../controllers/auth.controller.js";
import {
  loginValidator,
  registerValidator,
  forgetPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
} from "../validators/validateAuthRequest.js";

const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/forgetPassword", forgetPasswordValidator, forgetPassword);
router.post("/verifyResetCode", verifyResetCodeValidator, verifyResetCode);
router.put("/resetPassword", resetPasswordValidator, resetPassword);

export default router;
