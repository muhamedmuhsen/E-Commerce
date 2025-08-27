import express from "express";
import authenticateJWT from "../middlewares/authenticateJWT.js";
import {
  addReview,
  deleteReview,
  getReviewOfProduct,
  updateReview,getAllReviewsOfProduct
} from "../controllers/reviews.controller.js";
import {
  addReviewValidator,
  deleteReviewValidator,
  getReviewOfProductValidator,
  updateReviewValidator,getAllReviewsOfProductValidator
} from "../validators/validateReviewRequest.js";

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
