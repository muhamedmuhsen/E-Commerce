import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

/*
    @desc   Register new user
    @route  POST /api/v1/auth/register
    @access Public
*/

// TODO(add validation layer)
const register = asyncWrapper(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new ApiError("User already exists", 400));
  }

  if (!req.body) {
    return next(new ApiError("all fields are required", 400));
  }

  if (password !== passwordConfirm) {
    return next(new ApiError("the password doe not match", 400));
  }

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  await newUser.save();

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  if (!token) {
    return next(new ApiError("Invalid Token", 401));
  }

  res
    .status(201)
    .json({ success: true, message: "User registered successfully", token });
});

/*
    @desc   Login user
    @route  POST /api/v1/auth/login
    @access Public
*/
const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ApiError("all fields are required", 400));
  }
  const searchUser = await User.findOne({ email });
  if (!searchUser || !(await bcrypt.compare(password, searchUser.password))) {
    return next(new ApiError("Invalid credentials", 401));
  }

  const token = jwt.sign({ id: searchUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res
    .status(200)
    .json({ success: true, message: "logged in successfully", token });
});

const forgetPassword = asyncWrapper(async (req, res, next) => {
  const email = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("Wrong email", 404));
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedResetCode;
  user.passwordResetCodeExpire = Date.now() + 60 * 60 * 1000;
  user.passwordResetCodeVerified = false;

  await user.save();

  // Send mail to the user with reset code
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  await sendEmail({
    email: user.email,
    subject: "password reset code, valid for 1 hour",
    message,
  });

  res
    .status(200)
    .json({ success: true, message: "reset code sent successfully" });
});

export { login, register, forgetPassword };
