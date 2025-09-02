import validateRequest from "../middlewares/validate-request.js";
import { mongoId, name, category } from "./common.validator.js";

const createSubCategoryValidator = [
  name("SubCategory").notEmpty(),
  category().notEmpty().withMessage("Category must be belong to category"),
  validateRequest,
];

const updateSubCategoryValidator = [
  mongoId(),
  name("SubCategory").optional(),
  category().optional(),
  validateRequest,
];

const getSpecificSubCategoryValidator = [mongoId(), validateRequest];

const deleteSubCategoryValidator = [mongoId(), validateRequest];

export {
  createSubCategoryValidator,
  deleteSubCategoryValidator,
  updateSubCategoryValidator,
  getSpecificSubCategoryValidator,
};
