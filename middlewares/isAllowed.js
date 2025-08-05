import asyncWrapper from "./asyncWrapper.js";
import ApiError from "../utils/ApiError.js";

export default (...roles) => {
  return asyncWrapper(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });
};
