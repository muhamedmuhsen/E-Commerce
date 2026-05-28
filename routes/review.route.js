import express from "express";
import authenticateJWT from "../middlewares/authenticate-jwt.js";
import checkProductPurchase from "../middlewares/check-product-purchase.js";
import reviewController from "../controllers/review.controller.js";
import {
    addReviewValidator,
    deleteReviewValidator,
    getReviewOfProductValidator,
    updateReviewValidator,
    getAllReviewsOfProductValidator
} from "../validators/review.validator.js";

const router = express.Router();

// Public Reviews
router.get("/:id", getAllReviewsOfProductValidator, reviewController.wrap(reviewController.getAllReviewsOfProduct))

// Protected Reviews
router.use(authenticateJWT);

router
    .route("/:id")
    .post(checkProductPurchase, addReviewValidator, reviewController.wrap(reviewController.addReview))
    .put(updateReviewValidator, reviewController.wrap(reviewController.updateReview))
    .delete(deleteReviewValidator, reviewController.wrap(reviewController.deleteReview));

export default router;
