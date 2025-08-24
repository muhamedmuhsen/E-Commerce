import validateRequest from "../middlewares/validateRequest.js";
import { check } from "express-validator";
import Product from "../models/product.model.js";
import { mongoId } from "./commonValidators.js";
import _ from "lodash";

export const addToCartValidator = [
  mongoId("productId"),
  check("color")
    .notEmpty()
    .withMessage("You must enter product color")
    .custom(async (val, { req }) => {
      const product = await Product.findById(req.body.productId);
      if (!product) {
        throw new Error("product not found");
      }
      let notFoundColor = true;
      if (!product.colors || !Array.isArray(product.colors)) {
        throw new Error("This product has no available colors");
      }

      if (!product.colors.includes(val)) {
        throw new Error(
          `Invalid color. Available colors: ${product.colors.join(", ")}`
        );
      }
      return true;
    }),
  validateRequest,
];

export const updateCartItemQuantityValidtor = [
  check("quantity")
    .notEmpty()
    .withMessage("You must enter product quantity")
    .isInt()
    .withMessage("You must write valid numbers")
    .custom(async (val, { req }) => {
      const product = await Product.findById(req.params.id);

      if (!product) {
        throw new Error("Product not found");
      }

      if (!_.inRange(val, 1, product.quantity)) {
        throw new Error(`Quantity must be between 1 and ${product.quantity}`);
      }
      return true;
    }),
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
