import { check } from "express-validator";
import validateRequest from "../../middlewares/validateRequest.js";
import slugify from "slugify";

const commonRules = {
  id: check("id").isMongoId().withMessage("Invalid id"),
  name: check("name")
    .notEmpty()
    .isLength({ min: 3, max: 50 })
    .withMessage("SubCategory name must be between 3 and 50 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
};

const createSubCategoryValidator = [
  commonRules.name,
  check("category")
    .notEmpty()
    .withMessage("SubCategory must be belong to category")
    .isMongoId()
    .withMessage("Invalid category id "),
  validateRequest,
];

const updateSubCategoryValidator = [
  commonRules.id,
  commonRules.name,
  check("category").optional().isMongoId().withMessage("Invalid category id "),
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
