import validateRequest from "../middlewares/validate-request.js";
import { atLeastOneField, mongoId, name } from "./common.validator.js";
import { check } from "express-validator";

// Image validation is handled by multer fileFilter in config/multer.js
// Only JPEG, JPG, PNG, and WEBP files up to 5MB are allowed

const createBrandValidator = [
  name("Brand").notEmpty().withMessage("Brand name is required"),
  validateRequest
];

const updateBrandValidator = [
  mongoId(),
  atLeastOneField(["name", "image"]),
  name("Brand").optional(),
  validateRequest,
];

const deleteBrandValidator = [mongoId(), validateRequest];

const getSpecificBrandValidator = [mongoId(), validateRequest];

export {
  createBrandValidator,
  deleteBrandValidator,
  getSpecificBrandValidator,
  updateBrandValidator,
};
