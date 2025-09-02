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
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyResetCode", verifyResetCode);
router.put("/resetPassword", resetPassword);

export default router;
