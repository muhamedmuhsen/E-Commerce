import validateRequest from "../middlewares/validate-request.js";
import { mongoId, name } from "./common.validator.js";

const createCategoryValidator = [
  name("Category").notEmpty().withMessage("Category name is required"),
  validateRequest,
];

const updateCategoryValidator = [
  mongoId(),
  name("Category").optional(),
  validateRequest,
];

const getSpecificCategoryValidator = [mongoId(), validateRequest];

const deleteCategoryValidator = [mongoId(), validateRequest];

export {
  createCategoryValidator,
  deleteCategoryValidator,
  getSpecificCategoryValidator,
  updateCategoryValidator,
};
