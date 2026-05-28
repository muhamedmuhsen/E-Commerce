import validateRequest from "../middlewares/validate-request.js";
import { mongoId } from "./common.validator.js";

export const addProductToWishlistValidator = [
    mongoId("productId"),
    validateRequest
]
export const removeProductFromWishlistValidator = [
    mongoId(),
    validateRequest
]