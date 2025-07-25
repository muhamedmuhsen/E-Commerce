import { check } from "express-validator";
import validateRequest from "../../middlewares/validateRequest.js";
import slugify from "slugify";

const commonRules = {
  id: check("id").isMongoId().withMessage("Invalid id"),
  name: check("name")
    .notEmpty()
    .isLength({ min: 3, max: 32 })
    .withMessage("Category name must be between 3 and 32 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
};

const createBrandValidator = [commonRules.name, validateRequest];

const updateBrandValidator = [
  commonRules.id,
  check("name")
    .isLength({ min: 3 })
    .withMessage("Brand name too short")
    .isLength({ max: 32 })
    .withMessage("Brand name too long")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  // TODO(Validate Image Brand)
  validateRequest,
];

const deleteBrandValidator = [commonRules.id, validateRequest];

const getSpecificBrandValidator = [commonRules.id, , validateRequest];

export {
  createBrandValidator,
  deleteBrandValidator,
  getSpecificBrandValidator,
  updateBrandValidator,
};
