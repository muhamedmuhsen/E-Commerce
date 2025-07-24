import { check } from "express-validator";
import validateRequest from "../../middlewares/validateRequest.js";
import slugify from "slugify";

const createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .isLength({ min: 3, max: 50 })
    .withMessage("SubCategory name must be between 3 and 50 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  ,
  check("category")
    .notEmpty()
    .withMessage("SubCategory must be belong to category")
    .isMongoId()
    .withMessage("Invalid category id "),
  validateRequest,
];

const updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid id"),
  check("name")
    .notEmpty()
    .withMessage("SubCategory must have a name")
    .isLength({ min: 3, max: 50 })
    .withMessage("SubCategory name must be between 3 and 50 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category id "),
  validateRequest,
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
