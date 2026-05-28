import express from "express";
import authenticateJWT from "../middlewares/authenticate-jwt.js";
import {
  addProductToWishlistValidator,
  removeProductFromWishlistValidator,
} from "../validators/wish-list.validator.js";
import wishlistController from "../controllers/wish-list.controller.js";

const router = express.Router();

router.use(authenticateJWT);

router
  .route("/")
  .get(wishlistController.wrap(wishlistController.getWishlist))
  .post(addProductToWishlistValidator, wishlistController.wrap(wishlistController.addProduct))
  .delete(wishlistController.wrap(wishlistController.clearWishlist));

router.delete(
  "/:id",
  removeProductFromWishlistValidator,
  wishlistController.wrap(wishlistController.removeProduct)
);

export default router;
