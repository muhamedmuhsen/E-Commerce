import validateRequest from "../middlewares/validate-request.js";
import { atLeastOneField, mongoId, name } from "./common.validator.js";
import { check } from "express-validator";

// TODO(Validate Image Brand)

const createBrandValidator = [
  name("Brand").notEmpty().withMessage("Brand name is required"),
  validateRequest
];

const updateBrandValidator = [
  mongoId(),
  atLeastOneField(["name", "image"]),
  name("Brand").optional(),
  check("image").isURL().withMessage("you must write a valid image Url"),
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
