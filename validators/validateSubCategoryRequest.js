import validateRequest from "../middlewares/validateRequest.js";
import { mongoIdValidator, nameValidator } from "./commonValidators.js";

const commonRules = {
  id: mongoIdValidator("id", "Invalid subcategory id")
    .notEmpty()
    .withMessage("id is required"),
  name: nameValidator("name", 3, 50),
  category: mongoIdValidator("category", "Invalid category id"),
};

const createSubCategoryValidator = [
  commonRules.name.notEmpty(),
  commonRules.category
    .notEmpty()
    .withMessage("Category must belong to category"),
  validateRequest,
];

const updateSubCategoryValidator = [
  commonRules.id,
  commonRules.name.optional(),
  commonRules.category.optional(),
  validateRequest,
];

const getSpecificSubCategoryValidator = [commonRules.id, validateRequest];

const deleteSubCategoryValidator = [commonRules.id, validateRequest];

export {
  createSubCategoryValidator,
  deleteSubCategoryValidator,
  updateSubCategoryValidator,
  getSpecificSubCategoryValidator,
};
