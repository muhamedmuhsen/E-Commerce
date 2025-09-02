import validateRequest from "../middlewares/validate-request.js";
import cities from "../utils/constants/cities.js";
import { mongoId } from "./common.validator.js";
import { check } from "express-validator";

export const deleteOrderValidator = [mongoId(), validateRequest];

export const getOrderValidator = [mongoId(), validateRequest];

export const createOrderValidator = [
  mongoId(),
  check("paymentMethod")
    .optional()
    .isIn(["Card", "COD"])
    .withMessage("Payment method must between either Cash or Card"),
  check("shippingAddress")
    .isObject()
    .withMessage("Shipping address is required"),
  check("shippingAddress.city")
    .notEmpty()
    .withMessage("City is required")
    .isIn(cities),
  check("shippingAddress.zipCode")
    .notEmpty()
    .withMessage("Zip code is required")
    .isLength({ min: 3 })
    .withMessage("Zip code too short"),
];
