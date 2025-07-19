import { check } from "express-validator";
import validateRequest from "../../middlewares/validateRequest.js";


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
  updateSubCategoryValidator,
  getSpecificSubCategoryValidator,
};
