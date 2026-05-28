import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { UnauthorizedError } from "../utils/api-errors.js";
import asyncWrapper from "./async-wrapper.js";

export default asyncWrapper(async (req, res, next) => {
  const { authorization: authHeader } = req.headers;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Access denied"));
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new UnauthorizedError("Access denied"));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decode.id);

  if (!user) {
    return next(
      new UnauthorizedError(
        "The user that belong to this token does no longer exist"
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
      return next(new UnauthorizedError("Access denied, please login again"));
    }
  }

  req.user = user;
  next();
});
