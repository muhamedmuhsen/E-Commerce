import { check } from "express-validator";
import validateRequest from "../../middlewares/validateRequest.js";
import slugify from "slugify";

const createBrandValidator = [
   check("name")
      .isLength({ min: 3, max: 32 })
      .withMessage("Brand name must be between 3 and 32 characters")
      .custom((value, { req }) => {
        req.body.slug = slugify(value);
        return true;
      }),
  validateRequest,
];

const updateBrandValidator = [
  check("name")
    .isLength({ min: 3 })
    .withMessage("Brand name too short")
    .isLength({ max: 32 })
    .withMessage("Brand name too long")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("id")
    .notEmpty()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Invalid Brand id "),
  validateRequest,
];

const deleteBrandValidator = [
  check("id")
    .notEmpty()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Invalid Brand id "),
  validateRequest,
];

const getSpecificBrandValidator = [
  check("id")
    .notEmpty()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Invalid Brand id "),
  validateRequest,
];

export {
  createBrandValidator,
  deleteBrandValidator,
  getSpecificBrandValidator,
  updateBrandValidator,
};
