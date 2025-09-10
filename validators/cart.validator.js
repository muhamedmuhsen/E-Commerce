import validateRequest from "../middlewares/validate-request.js";
import {check} from "express-validator";
import Product from "../models/product.model.js";
import {mongoId} from "./common.validator.js";
import _ from "lodash";
import {BadRequestError, NotFoundError} from "../utils/api-errors.js";

export const addToCartValidator = [mongoId("productId"), check("color")
    .notEmpty()
    .withMessage("You must enter product color"), validateRequest,];

export const updateProductQuantityValidator = [mongoId(), check("quantity")
    .notEmpty()
    .withMessage("You must enter product quantity")
    .isInt()
    .withMessage("You must write valid numbers"), validateRequest,];

export const applyCouponValidator = [check("name")
    .notEmpty()
    .withMessage("Coupon name is required")
    .isLength({min: 2, max: 32})
    .withMessage("Coupon name must be between 2 and 32 characters")
    .trim(), validateRequest,];
