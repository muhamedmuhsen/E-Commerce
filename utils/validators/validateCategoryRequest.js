import { check } from "express-validator";
import validateRequest from "../../middlewares/validateRequest.js";
import slugify from "slugify";
const createCategoryValidator = [
  check("name").isLength({ min: 3 }).withMessage("Category name too short"),
  check("name").isLength({ max: 32 }).withMessage("category name too long"),
  validateRequest,
];

const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid id"),
  check("name")
    .isLength({ min: 3 })
    .withMessage("Category name too short")
    .isLength({ max: 50 })
    .withMessage("Category name too long")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  createCategoryValidator,
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
