import { check } from "express-validator";
import validateRequest from "../../middlewares/validateRequest.js";

const createBrandValidator = [
  check("name")
    .isLength({ min: 3 })
    .withMessage("Brand name too short")
    .isLength({ max: 32 })
    .withMessage("Brand name too long"),
  validateRequest,
];

const updateBrandValidator = [
  check("name")
    .isLength({ min: 3 })
    .withMessage("Brand name too short")
    .isLength({ max: 32 })
    .withMessage("Brand name too long"),
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

const getSpecificBrandValidtor = [
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
  getSpecificBrandValidtor,
  updateBrandValidator,
};
