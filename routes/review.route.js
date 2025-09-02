import express from "express";
import authenticateJWT from "../middlewares/authenticate-jwt.js";
import {
  addReview,
  deleteReview,
  getReviewOfProduct,
  updateReview,getAllReviewsOfProduct
} from "../controllers/review.controller.js";
import {
  addReviewValidator,
  deleteReviewValidator,
  getReviewOfProductValidator,
  updateReviewValidator,getAllReviewsOfProductValidator
} from "../validators/review.validator.js";

const router = express.Router();

// Puplic Reviews
router.get("/:id",getAllReviewsOfProductValidator, getAllReviewsOfProduct)

// Protected Reviews
router.use(authenticateJWT);

//TODO(middleware to check if the user purchased the product so he can review)
router
  .route("/:id")
  .post(addReviewValidator, addReview)
  .put(updateReviewValidator, updateReview)
  .delete(deleteReviewValidator, deleteReview);

export default router;
