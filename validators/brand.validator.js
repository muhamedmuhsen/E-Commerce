import validateRequest from "../middlewares/validate-request.js";
import { mongoId, name } from "./common.validator.js";

const createBrandValidator = [
  name("Brand").notEmpty().withMessage("Brand name is required"),
  validateRequest,
];

const updateBrandValidator = [
  mongoId(),
  name("Brand"),
  // TODO(Validate Image Brand)
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
