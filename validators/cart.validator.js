import validateRequest from "../middlewares/validate-request.js";
import { check } from "express-validator";
import Product from "../models/product.model.js";
import { mongoId } from "./common.validator.js";
import _ from "lodash";
import { BadRequestError, NotFoundError } from "../utils/api-errors.js";

export const addToCartValidator = [
  mongoId("productId"),
  check("color")
    .notEmpty()
    .withMessage("You must enter product color")
    .custom(async (val, { req }) => {
      const product = await Product.findById(req.body.productId);
      if (!product) {
        throw new NotFoundError("product not found");
      }
      let notFoundColor = true;
      if (!product.colors || !Array.isArray(product.colors)) {
        throw new Error("This product has no available colors");
      }

      if (!product.colors.includes(val)) {
        throw new BadRequestError(
          `Invalid color. Available colors: ${product.colors.join(", ")}`
        );
      }
      return true;
    }),
  validateRequest,
];

export const updateProductQuantityValidtor = [
  mongoId(),
  check("quantity")
    .notEmpty()
    .withMessage("You must enter product quantity")
    .isInt()
    .withMessage("You must write valid numbers"),
  validateRequest,
];

export const applyCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("Coupon name must be between 2 and 32 characters")
    .trim(),
  validateRequest,
];
