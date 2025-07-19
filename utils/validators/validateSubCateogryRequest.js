import { check } from "express-validator";
import validateRequest from "../../middlewares/validateRequest.js";

const getAllSubCategoriesValidator = [
  check("page")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Page must be a number between 1 and 100"),
  check("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be a number between 1 and 50"),
  validateRequest,
];
const createSubCategoryValidator = [
  check("name")
    .isLength({ min: 3 })
    .withMessage("Category name too short")
    .isLength({ max: 32 })
    .withMessage("category name too long"),

  check("category")
    .notEmpty()
    .withMessage("subCategory must be belong to category")
    .isMongoId()
    .withMessage("Invalid category id "),
  validateRequest,
];

const updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid id"),
  createSubCategoryValidator,
];

const getSpecificSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid id"),
  validateRequest,
];

const deleteSubCategoryValidator = [getSpecificSubCategoryValidator];

export {
  createSubCategoryValidator,
  deleteSubCategoryValidator,
  getAllSubCategoriesValidator,
  updateSubCategoryValidator,
  getSpecificSubCategoryValidator,
};
