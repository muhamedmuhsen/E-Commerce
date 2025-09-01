import express from "express";
import authenticateJWT from "../middlewares/authenticate-jwt.js";
import { getLoggedUser } from "../controllers/user.controller.js";
import {
  getCartProducts,
  addToCart,
  removeAllFromCart,
  updateProductQuantity,
  removeSpecificCartItem,
  applyCoupon,
} from "../controllers/cart.controller.js";
import {
  addToCartValidator,
  updateProductQuantityValidtor,
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
  .put(updateProductQuantityValidtor, updateProductQuantity)
  .delete(removeSpecificCartItem);


export default router;
