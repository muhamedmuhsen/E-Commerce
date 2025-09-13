import Product from "../models/product.model.js";
import {BadRequestError, NotFoundError} from "../utils/api-errors.js";
import Review from "../models/review.model.js";
import ApiFeatures from "../utils/api-features.js";

class ReviewsService {
    #Review;
    #Product;

    constructor(Review, Product) {
        this.#Review = Review;
        this.#Product = Product;
    }

    async addReview(user, productId, rating, message = null) {

        const [product, existingReview] = await Promise.all([
            this.#Product.exists({_id: productId}),
            this.#Review.findOne({user, product: productId})
        ])

        if (!product)
            throw new NotFoundError("Product not found");

        if (existingReview)
            throw new BadRequestError("You have already reviewed this product");

        const review = await this.#Review.create({
            review: rating, message, product: productId, user
        });

        const reviews = await this.#Review.find().where("product", productId);
        console.log(reviews)
        const size = await this.#Review.countDocuments().where("product", productId);
        console.log(size)
        await this.calcuateAvgRating(reviews, size, productId);

        return review;
    }

    async getReviewOfProduct(user, productId) {
        const review = await this.#Review.findOne({user, product: productId});

        if (!review) {
            throw new NotFoundError("Couldn't find a review, it seems you didn't review this product");
        }

        return review;
    }

    async updateReview(user, product, rating, message) {
        const updateData = {review: rating};

        if (message !== undefined) {
            updateData.message = message.trim();
        }

        const review = await this.#Review.findOneAndUpdate({user, product}, updateData, {
            new: true,
            runValidators: true
        }).populate("user", "name");

        if (!review) {
            throw new NotFoundError("Couldn't find a review, it seems you didn't review this product");
        }

        const reviews = await this.#Review.find({product});
        const size = await Review.countDocuments({product});
        await this.calcuateAvgRating(reviews, size, product);

        return review;
    }

    async deleteReview(user, product) {
        const review = await this.#Review.findOneAndDelete({user, product});

        if (!review) {
            throw new NotFoundError("Couldn't find a review, it seems you didn't review this product");
        }
        const reviews = await this.#Review.find({product});
        const size = await Review.countDocuments({product});
        await this.calcuateAvgRating(reviews, size, product);

        return review;
    }

    async getAllReviewsOfProduct(product, query) {
        let totalReviews = await this.#Review.countDocuments({product});

        const apiFeatures = new ApiFeatures(query, this.#Review.find({product}))
            .filter()
            .sorting()
            .paginate(totalReviews);

        let reviews = await apiFeatures.mongooseQuery
            .populate("user", "name")
            .populate("product", "name");

        if (!reviews || totalReviews === 0) {
            throw new NotFoundError("Couldn't find reviews for this product");
        }
        let pagination = apiFeatures.pagination;

        if (totalReviews === 0) {
            totalReviews = 0;
            pagination.currentPage = 1;
            pagination.next = undefined;
            pagination.numberOfPages = 1;
            pagination.prev = undefined;
        }

        return {reviews, totalReviews, pagination};
    }

    // should user aggregate here
    async calcuateAvgRating(reviews, size, product) {
        let totalSumOfRatings = 0.0, totalAvgRating ;

        if (size === 0) totalAvgRating = undefined;
        else {
            totalSumOfRatings = reviews.reduce((sum, ele) => sum + ele.review, 0);
            totalAvgRating = (totalSumOfRatings / size).toFixed(2);
        }

        if (totalAvgRating > 5) totalAvgRating = 5;

        await this.#Product.findByIdAndUpdate(product, {
            ratingsAverage: totalAvgRating, ratingsQuantity: size,
        }, {new: true});
    }
}

export default new ReviewsService(Review, Product)