import { check } from "express-validator";
import validateRequest from "../middlewares/validateRequest.js";
import slugify from "slugify";

const commonRules = {
  id: check("id").isMongoId().withMessage("Invalid id"),
  name: check("name")
    .isLength({ min: 3, max: 32 })
    .withMessage("Category name must be between 3 and 32 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
};

const createCategoryValidator = [
  commonRules.name.notEmpty().withMessage("Category name is requird"),
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
