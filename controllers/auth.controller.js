import bcrypt from "bcryptjs";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

const signup = asyncWrapper(async (req, res, next) => {
  const user = req.body;

  if (!user) {
    return next(new ApiError("all fields are required", 400));
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);

  const newUser = new User({
    name: user.name,
    email: user.email,
    password: hashedPassword,
  });

  await newUser.save();

  res.status(201).json({ succes: true, data: newUser });
});

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

  res.status(200).json({ success: true, message: "logged in successfully" });
});

export { login, signup };
