import express from "express";
import authenticateJWT from "../middlewares/authenticate-jwt.js";
import UserController from "../controllers/user.controller.js";
import CartController from "../controllers/cart.controller.js";
import {
    addToCartValidator, updateProductQuantityValidator, applyCouponValidator,
} from "../validators/cart.validator.js";

const router = express.Router();

router.use(authenticateJWT, UserController.getLoggedUser);

router
    .route("/")
    .get(CartController.wrap(CartController.getCartItems))
    .post(addToCartValidator, CartController.wrap(CartController.addItem))
    .delete(CartController.wrap(CartController.clearCartItems))

router.put("/apply-coupon", applyCouponValidator, CartController.wrap(CartController.applyCoupon))

router
    .route("/:id")
    .put(updateProductQuantityValidator, CartController.wrap(CartController.updateProductQuantity))
    .delete(CartController.wrap(CartController.removeItem));


export default router;
