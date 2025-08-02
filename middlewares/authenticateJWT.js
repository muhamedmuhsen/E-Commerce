import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncWrapper from "./asyncWrapper.js";

export default asyncWrapper(async (req, res, next) => {
  const { authorization: authHeader } = req.headers;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError("Access denied", 401));
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new ApiError("Access denied", 401));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decode.id);

  if (!user) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }

  // check if the user change the password after token creation
  if (user.passwordChangeAt) {
    const passwordChangedTime = parseInt(
      user.passwordChangeAt.getTime() / 1000,
      10
    );
    if (passwordChangedTime > decode.iat) {
      return next(new ApiError("Access denied, please login again", 401));
    }
  }

  req.user = user;
  next();
});
