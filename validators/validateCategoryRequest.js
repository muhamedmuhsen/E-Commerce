import validateRequest from "../middlewares/validateRequest.js";
import { mongoIdValidator, nameValidator } from "./commonValidators.js";

const commonRules = {
  id: mongoIdValidator("id", "Invalid category id"),
  name: nameValidator("name", 3, 32),
};

const createCategoryValidator = [
  commonRules.name.notEmpty().withMessage("Category name is required"),
  validateRequest,
];

const updateCategoryValidator = [
  commonRules.id,
  commonRules.name.optional(),
  validateRequest,
];

const getSpecificCategoryValidator = [commonRules.id, validateRequest];

const deleteCategoryValidator = [commonRules.id, validateRequest];

export {
  createCategoryValidator,
  deleteCategoryValidator,
  getSpecificCategoryValidator,
  updateCategoryValidator,
};
