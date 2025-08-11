import { check } from "express-validator";
import validateRequest from "../middlewares/validateRequest.js";
import slugify from "slugify";

const commonRules = {
  id: check("id").isMongoId().withMessage("Invalid id"),
  name: check("name")
    .isLength({ min: 3, max: 32 })
    .withMessage("Category name must be between 3 and 32 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
};

const createBrandValidator = [
  commonRules.name.notEmpty().withMessage("Brand name is requried"),
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
