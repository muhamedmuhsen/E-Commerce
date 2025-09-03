import asyncWrapper from "../middlewares/async-wrapper.js";
import AuthService from "../services/auth.service.js";


/**
 * @desc   Register new user
 * @route  POST /api/v1/auth/register
 * @access Public
 */
const registerController = asyncWrapper(async (req, res, next) => {
  const token = await AuthService.register(
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
  const token = await AuthService.login(req.body.email, req.body.password);

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
  await AuthService.forgetPassword(req.body.email);

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
  await AuthService.verifyResetCode(req.body.resetCode);

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
  const token = await AuthService.resetPassword(
    req.body.email,
    req.body.newPassword
  );

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
