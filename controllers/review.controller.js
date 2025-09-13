import asyncWrapper from "../middlewares/async-wrapper.js";
import ReviewsService from "../services/review.service.js";


class ReviewController {
    #reviewService

    constructor(ReviewService) {
        this.#reviewService = ReviewService;
    }

    wrap(fn) {
        return asyncWrapper(fn.bind(this))
    }

    async addReview(req, res, next) {

        const review = await this.#reviewService.addReview(req.user._id, req.params.id, req.body.review, req.body.message);
        console.log(review)
        res.status(201).json({
            success: true, message: "Review added successfully", data: review,
        });
    }

    async getAllReviewsOfProduct(req, res, next) {
        const {
            reviews, totalReviews, pagination
        } = await this.#reviewService.getAllReviewsOfProduct(req.params.id, req.query);

        res.status(200).json({
            success: true, totalReviews, pagination, message: "Reviews retrieved successfully", data: reviews,
        });
    }

    async getReviewOfProduct(req, res, next) {
        const review = await this.#reviewService.getReviewOfProduct(req.user._id, req.params.id);

        res.status(200).json({
            success: true, message: "Review retrieved successfully", data: review,
        });
    }

    async updateReview(req, res, next) {
        const review = await ReviewsService.updateReview(req.user._id, req.params.id, req.body.review, req.body.message);
        res.status(200).json({
            success: true, message: "Review updated successfully", data: review,
        });
    }

    async deleteReview(req, res, next) {
        await ReviewsService.deleteReview(req.user._id, req.params.id);
        res.status(200).json({
            success: true, message: "Review removed successfully",
        });
    }
}

export default new ReviewController(ReviewsService);