import Product from "../models/product.model.js";
import { BadRequestError, NotFoundError } from "../utils/ApiErrors.js";
import Review from "../models/reviews.model.js";
import ApiFeatures from "../utils/apiFeatures.js";

export default class ReviewsService {
  async addReview(user, productId, rating, message = "") {
    const product = await Product.findById(productId);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const existingReview = await Review.findOne({ user, product: productId });

    if (existingReview) {
      throw new BadRequestError("You have already reviewed this product");
    }

    const review = new Review({
      review: rating,
      message,
      product: productId,
      user,
    });

    await review.save();

    const reviews = await Review.find({ product });
    const size = await Review.countDocuments({ product });

    await this.calcuateAvgRating(reviews, size, product);

    return review;
  }

  async getReviewOfProduct(user, productId) {
    const review = await Review.findOne({ user, product: productId });

    if (!review) {
      throw new NotFoundError(
        "Couldn't find a review, it seems you didn't review this product"
      );
    }

    return review;
  }

  async updateReview(user, product, rating, message) {
    const updateData = { review: rating };

    if (message !== undefined) {
      updateData.message = message.trim();
    }

    const review = await Review.findOneAndUpdate(
      { user, product },
      updateData,
      { new: true, runValidators: true }
    ).populate("user", "name");

    if (!review) {
      throw new NotFoundError(
        "Couldn't find a review, it seems you didn't review this product"
      );
    }

    const reviews = await Review.find({ product });
    const size = await Review.countDocuments({ product });
    await this.calcuateAvgRating(reviews, size, product);

    return review;
  }

  async deleteReview(user, product) {
    const review = await Review.findOneAndDelete({ user, product });

    if (!review) {
      throw new NotFoundError(
        "Couldn't find a review, it seems you didn't review this product"
      );
    }
    const reviews = await Review.find({ product });
    const size = await Review.countDocuments({ product });
    await this.calcuateAvgRating(reviews, size, product);

    return review;
  }

  async getAllReviewsOfProduct(product, query) {
    const totalReviews = await Review.countDocuments({ product });

    const apiFeatures = new ApiFeatures(query, Review.find({ product }))
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

    return { reviews, totalReviews, pagination };
  }

  // should user aggreagate here
  async calcuateAvgRating(reviews, size, product) {
    let totalSumOfRatings = 0.0,
      totalAvgRating = 0.0;

    if (size === 0) totalAvgRating = undefined;
    else {
      totalSumOfRatings = reviews.reduce((sum, ele) => sum + ele.review, 0);
      totalAvgRating = (totalSumOfRatings / size).toFixed(2);
    }

    if (totalAvgRating > 5) totalAvgRating = 5;

    const id = product;

    await Product.findByIdAndUpdate(
      id,
      {
        ratingsAverage: totalAvgRating,
        ratingsQuantity: size,
      },
      { new: true }
    );
  }
}
