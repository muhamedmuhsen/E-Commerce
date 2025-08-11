import validateRequest from "../middlewares/validateRequest.js";
import { mongoIdValidator, nameValidator } from "./commonValidators.js";

const commonRules = {
  id: mongoIdValidator("id", "Invalid brand id"),
  name: nameValidator("name", 3, 32),
};

const createBrandValidator = [
  commonRules.name.notEmpty().withMessage("Brand name is required"),
  validateRequest,
];

const updateBrandValidator = [
  commonRules.id,
  commonRules.name.optional(),
  // TODO(Validate Image Brand)
  validateRequest,
];

const deleteBrandValidator = [commonRules.id, validateRequest];

const getSpecificBrandValidator = [commonRules.id, validateRequest];

export {
  createBrandValidator,
  deleteBrandValidator,
  getSpecificBrandValidator,
  updateBrandValidator,
};
