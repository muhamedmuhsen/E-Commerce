import validateRequest from "../middlewares/validateRequest.js";
import cities from "../utils/cities.js";
import { mongoId } from "./commonValidators.js";

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
