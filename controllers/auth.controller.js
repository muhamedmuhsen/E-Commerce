import bcrypt from "bcryptjs";
import asyncWrapper from "../middlewares/async-wrapper.js";
import User from "../models/user.model.js";
import {
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} from "../utils/api-errors.js";
import hashingPassword from "../utils/hash-password.js";
import {
  registerService,
  loginService,
  forgetPasswordService,
  verifyResetCodeService,
  resetPasswordService,
} from "../services/auth.service.js";

/**
 * @desc   Register new user
 * @route  POST /api/v1/auth/register
 * @access Public
 */
const registerController = asyncWrapper(async (req, res, next) => {
  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser) {
    return next(new BadRequestError("User already exists"));
  }

  if (req.body.passwordConfirm !== req.body.password) {
    return next(UnauthorizedError("Passwords do not match"));
  }

  const { token } = await registerService(
    req.body.name,
    req.body.email,
    req.body.password
  );

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
  });
});

/**
 * @desc   Login user
 * @route  POST /api/v1/auth/login
 * @access Public
 */
const loginSController = asyncWrapper(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new UnauthorizedError("Invalid credentials"));
  }
  const token = await loginService(user._id);
  res
    .status(200)
    .json({ success: true, message: "logged in successfully", token });
});

/**
 * @desc   Forget password - send reset code to user email
 * @route  POST /api/v1/auth/forgetPassword
 * @access Public
 */
const forgetPasswordController = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new NotFoundError("Email not found"));
  }

  await forgetPasswordService(user);

  res
    .status(200)
    .json({ success: true, message: "reset code sent successfully" });
});

/**
 * @desc   Verify password reset code
 * @route  POST /api/v1/auth/verifyResetCode
 * @access Public
 */
const verifyResetCodeController = asyncWrapper(async (req, res, next) => {
  const { resetCode } = req.body;

  const hashedResetCode = hashingPassword(resetCode);

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetCodeExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new BadRequestError("Invalid reset code"));
  }

  await verifyResetCodeService(user);

  res
    .status(200)
    .json({ success: true, message: "Reset code verified successfully" });
});

/**
 * @desc   Reset password with new password
 * @route  PUT /api/v1/auth/resetPassword
 * @access Public
 */
const resetPasswordController = asyncWrapper(async (req, res, next) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new NotFoundError("user not found"));
  }

  if (!user.passwordResetCodeVerified) {
    return next(new BadRequestError("reset code not verified"));
  }

  const token = await resetPasswordService(user, newPassword);

  res
    .status(200)
    .json({ success: true, message: "Password rested successfully", token });
});
export {
  loginSController,
  registerController,
  forgetPasswordController,
  resetPasswordController,
  verifyResetCodeController,
};
