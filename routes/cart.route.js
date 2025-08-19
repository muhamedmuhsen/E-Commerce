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
const router = express.Router();

router.use(authenticateJWT, getLoggedUser);

router
  .route("/")
  .get(getCartProducts)
  .post(addToCart)
  .delete(removeAllFromCart);

router.route("/:id").put(updateCartItemQuantity).delete(removeSpecificCartItem);

export default router;
