import { check, validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error = result.errors;
    return res.status(400).json({ success: false, code: 400, error });
  }
  next();
};

const getAllCategoriesValidator = [
  check("page")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Page must be a number between 1 and 100"),
  check("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be a number between 1 and 50"),
  validateRequest,
];
const createCategoryValidator = [
  check("name").isLength({ min: 3 }).withMessage("Category name too short"),
  check("name").isLength({ max: 32 }).withMessage("category name too long"),
  validateRequest,
];

const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid id"),
  createCategoryValidator,
];

const getSpecificCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid id"),
  validateRequest,
];

const deleteCategoryValidator = [getSpecificCategoryValidator];

export {
  createCategoryValidator,
  deleteCategoryValidator,
  getAllCategoriesValidator,
  getSpecificCategoryValidator,
  updateCategoryValidator,
};
