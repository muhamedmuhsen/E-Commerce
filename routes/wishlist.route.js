import express from "express";
import authenticateJWT from "../middlewares/authenticateJWT.js";
import {
  addProductToWishlistValidator,
  removeProductFromWishlistValidator,
} from "../validators/validateWishlistRequest.js";
import {
  addProductToWishlist,
  getAllProductsInWishlist,
  removeAllFromWishlist,
  removeProductFromWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.use(authenticateJWT);

router
  .route("/")
  .get(getAllProductsInWishlist)
  .post(addProductToWishlistValidator, addProductToWishlist)
  .delete(removeAllFromWishlist);

router.delete(
  "/:id",
  removeProductFromWishlistValidator,
  removeProductFromWishlist
);

export default router;
