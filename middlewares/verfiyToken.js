import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncWrapper from "./asyncWrapper.js";

export default asyncWrapper(async (req, res, next) => {
  try {
    const { authorization: authHeader } = req.headers;

    if (!authHeader) {
      return next(new ApiError("Access denied", 401));
    }
    const token = authHeader.split(" ")[1];

    const decode = jwt.verify(token, process.env.JWT_SECERT);

    // TODO(check if the user found in another function)
    const user = await User.findById(decode.userId);
    if (!user) {
      return next(new ApiError("user not found", 404));
    }
    next();
  } catch (error) {
    return next(new ApiError("Invalid token", 401));
  }
});
