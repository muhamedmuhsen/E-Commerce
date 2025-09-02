import express from "express";
import authenticateJWT from "../middlewares/authenticate-jwt.js";
import {
  addProductToWishlistValidator,
  removeProductFromWishlistValidator,
} from "../validators/wish-list.validator.js";
import {
  addProductToWishlist,
  getAllProductsInWishlist,
  removeAllFromWishlist,
  removeProductFromWishlist,
} from "../controllers/wish-list.controller.js";

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
