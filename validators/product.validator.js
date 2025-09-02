import validateRequest from "../middlewares/validate-request.js";
import {
  atLeastOneField,
  mongoId,
  subcategories,
  name,
  brand,
  ratingsQuantity,
  description,
  quantity,
  sold,
  price,
  priceAfterDiscount,
  colors,
  imageCover,
  images,
  category,
  ratingsAverage,
} from "./common.validator.js";

const createProductValidator = [
  name("Product").notEmpty().withMessage("Product name is required"),
  description().notEmpty().withMessage("Product description is required"),
  quantity().notEmpty().withMessage("Product quantity is required"),
  sold(),
  price().notEmpty().withMessage("Product price is required"),
  priceAfterDiscount(),
  colors(),
  imageCover(),
  images(),
  category().notEmpty().withMessage("Product must belong to a category"),
  ratingsAverage(),
  ratingsQuantity(),
  subcategories(),
  validateRequest,
];

const updateProductValidator = [
  mongoId(),
  name("Product").optional(),
  description().optional(),
  quantity().optional(),
  sold(),
  price(),
  colors(),
  images(),
  category().optional(),
  subcategories(false), // Single subcategory for updates
  brand(),
  ratingsAverage(),
  ratingsQuantity(),
  atLeastOneField(),
  validateRequest,
];

const getSpecificProductValidator = [mongoId(), validateRequest];

const deleteProductValidator = getSpecificProductValidator;

export {
  createProductValidator,
  deleteProductValidator,
  getSpecificProductValidator,
  updateProductValidator,
};
