import { check } from "express-validator";
import validateRequest from "../middlewares/validateRequest.js";
import slugify from "slugify";

const commonRules = {
  id: check("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("Invalid id"),
  name: check("name")
    .isLength({ min: 3, max: 50 })
    .withMessage("SubCategory name must be between 3 and 50 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  category: check("category").isMongoId().withMessage("Invalid category id "),
};

const createSubCategoryValidator = [
  commonRules.name.notEmpty(),
  commonRules.category
    .notEmpty()
    .withMessage("Category must be belong to category"),
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
