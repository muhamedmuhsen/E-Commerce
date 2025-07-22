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
const register = asyncWrapper(async (req, res, next) => {
  const user = req.body;
  console.log(user);

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

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECERT, {
    expiresIn: "1h",
  });

  res
    .status(201)
    .json({ succes: true, message: "User registered successfully", token });
});

/*
    @desc   Login user
    @route  POST /api/v1/auth/login
    @access Public
*/
const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email && !password) {
    return next(new ApiError("all fields are required", 400));
  }

  const dbUser = await User.findOne({ email: email });

  if (!dbUser) {
    return next(new ApiError("user not found", 404));
  }

  const comparedPassword = await bcrypt.compare(password, dbUser.password);

  if (!comparedPassword) {
    return next(new ApiError("unauthorized user", 401));
  }

  const token = jwt.sign({ userId: dbUser._id }, process.env.JWT_SECERT, {
    expiresIn: "1h",
  });

  res
    .status(200)
    .json({ success: true, message: "logged in successfully" }, token);
});

export { login, register };
