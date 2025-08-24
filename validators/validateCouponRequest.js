import { check } from "express-validator";
import validateRequest from "../middlewares/validateRequest.js";
import { atLeastOneField, mongoId, name } from "./commonValidators.js";

const commonCouponValidtor = {
  ExpirationDate: check("expire")
    .isISO8601()
    .withMessage("Expiration must be a valid date (YYYY-MM-DD)")
    .custom((val) => {
      if (new Date(val) < new Date()) {
        throw new Error("Date must be in the future");
      }
      return true;
    }),

  Discount: check("discount")
    .isFloat({ min: 1, max: 100 })
    .withMessage("Discount must be a number between 1 and 100"),
};

export const createCouponValidator = [
  name().notEmpty().withMessage("Coupon name is required"),
  commonCouponValidtor.ExpirationDate.notEmpty().withMessage(
    "Expiration Date is required"
  ),
  commonCouponValidtor.Discount.notEmpty().withMessage("Discount is required"),
  validateRequest,
];

export const getSpecificCouponValidator = [mongoId(), validateRequest];

export const updateCouponValidator = [
  mongoId(),
  atLeastOneField(["name", "expire", "discount"]),
  name().optional(),
  commonCouponValidtor.Discount.optional(),
  commonCouponValidtor.ExpirationDate.optional(),
  validateRequest,
];

export const deleteCouponValidator = [
    mongoId(),
    validateRequest
]