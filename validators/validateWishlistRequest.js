import validateRequest from "../middlewares/validateRequest.js";
import { mongoId } from "./commonValidators.js";

export const addProductToWishlistValidator = [
    mongoId("productId"),
    validateRequest
]
export const removeProductFromWishlistValidator = [
    mongoId(),
    validateRequest
]