import express from "express";
import authenticateJWT from "../middlewares/authenticate-jwt.js";
import { getLoggedUser } from "../controllers/user.controller.js";
import {
  getCartProducts,
  addToCart,
  removeAllFromCart,
  updateCartItemQuantity,
  removeSpecificCartItem,
  applyCoupon,
} from "../controllers/cart.controller.js";
import {
  addToCartValidator,
  updateCartItemQuantityValidtor,
  applyCouponValidator,
} from "../validators/cart.validator.js";
const router = express.Router();

router.use(authenticateJWT, getLoggedUser);

router
  .route("/")
  .get(getCartProducts)
  .post(addToCartValidator, addToCart)
  .delete(removeAllFromCart);

router.put("/apply-coupon", applyCouponValidator, applyCoupon);

router
  .route("/:id")
  .put(updateCartItemQuantityValidtor, updateCartItemQuantity)
  .delete(removeSpecificCartItem);


export default router;
