import { check } from "express-validator";
import validateRequest from "../../middlewares/validateRequest.js";

const createCategoryValidator = [
  check("name").isLength({ min: 3 }).withMessage("Category name too short"),
  check("name").isLength({ max: 32 }).withMessage("category name too long"),
  validateRequest,
];

const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid id"),
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
