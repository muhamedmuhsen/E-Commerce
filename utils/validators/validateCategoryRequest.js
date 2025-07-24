import { check } from "express-validator";
import validateRequest from "../../middlewares/validateRequest.js";
import slugify from "slugify";
const createCategoryValidator = [
  check("name")
    .notEmpty()
    .isLength({ min: 3, max: 50 })
    .withMessage("Category name must be between 3 and 100 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  validateRequest,
];

const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid id"),
  check("name")
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage("Category name must be between 3 and 100 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  validateRequest,
];

const getSpecificCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid id"),
  validateRequest,
];

const deleteCategoryValidator = [getSpecificCategoryValidator];

export {
  createCategoryValidator,
  deleteCategoryValidator,
  getSpecificCategoryValidator,
  updateCategoryValidator,
};
