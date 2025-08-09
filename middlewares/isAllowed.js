import asyncWrapper from "./asyncWrapper.js";
import { ForbiddenError } from "../utils/ApiErrors.js";

export default (...roles) => {
  return asyncWrapper(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError("You are not allowed to access this route", 403)
      );
    }
    next();
  });
};
