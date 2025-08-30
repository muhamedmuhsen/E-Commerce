import asyncWrapper from "./async-wrapper.js";
import { ForbiddenError } from "../utils/api-errors.js";

export default (...roles) => {
  return asyncWrapper( (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError('Insufficient permissions')
      );
    }
    next();
  });
};
