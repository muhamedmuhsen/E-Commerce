import express from "express";
import authenticateJWT from "../middlewares/authenticateJWT.js";
import { getLoggedUser } from "../controllers/user.controller.js";
import {
  getCartProducts,
  addToCart,
  removeAllFromCart,
  updateCartItemQuantity,
  removeSpecificCartItem,
} from "../controllers/cart.controller.js";
import {
  addToCartValidator,
  updateCartItemQuantityValidtor,
} from "../validators/validateCartRequest.js";
const router = express.Router();

router.use(authenticateJWT, getLoggedUser);

router
  .route("/")
  .get(getCartProducts)
  .post(addToCartValidator, addToCart)
  .delete(removeAllFromCart);

router
  .route("/:id")
  .put(updateCartItemQuantityValidtor, updateCartItemQuantity)
  .delete(removeSpecificCartItem);

export default router;
