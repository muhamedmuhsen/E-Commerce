import joi from "joi";
import ApiError from "../utils/ApiError.js";

const categorySchema = joi.object({
  name: joi.string().min(3).max(32).required(),
});

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const err = new ApiError(error.details[0].message);
      err.statusCode = 400;
      err.status = "fail";
      return next(err);
    }
    next();
  };
};
export { categorySchema, validateRequest };
