import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

/*
    @desc   Register new user
    @route  POST /api/v1/auth/register
    @access Public
*/

// TODO(add validation layer)
const register = asyncWrapper(async (req, res, next) => {
  const user = req.body;

  const existingUser = await User.findOne({ email: user.email });

  if (existingUser) {
    return next(new ApiError("User already exists", 400));
  }

  if (!user) {
    return next(new ApiError("all fields are required", 400));
  }

  if (user.password !== user.passwordConfirm) {
    return next(new ApiError("the password doe not match", 400));
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);

  const newUser = new User({
    name: user.name,
    email: user.email,
    password: hashedPassword,
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

export { login, register };
