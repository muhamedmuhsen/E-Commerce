import asyncWrapper from "../middlewares/async-wrapper.js";
import ReviewsService from "../services/review.service.js";

/**
 * @desc   Add a new review to a product
 * @route  POST /api/v1/reviews/:id
 * @access Private (must be logged in & typically own order)
 */
export const addReview = asyncWrapper(async (req, res, next) => {
  const review = await ReviewsService.addReview(
    req.user._id,
    req.params.id,
    req.body.review,
    req.body.message
  );

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    data: review,
  });
});

/**
 * @desc   Get all reviews for a specific product
 * @route  GET /api/v1/reviews/:id
 * @access Public
 */
export const getAllReviewsOfProduct = asyncWrapper(async (req, res, next) => {
  const { reviews, totalReviews, pagination } =
    await ReviewsService.getAllReviewsOfProduct(req.params.id, req.query);

  res.status(200).json({
    success: true,
    totalReviews,
    pagination,
    message: "Reviews retrived successfully",
    data: reviews,
  });
});

/**
 * @desc   Get one review of a product for the logged-in user
 * @route  GET /api/v1/reviews/:id/me
 * @access Private
 */
export const getReviewOfProduct = asyncWrapper(async (req, res, next) => {
  const review = await ReviewsService.getReviewOfProduct(
    req.user._id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Review retrieved successfully",
    data: review,
  });
});

/**
 * @desc   Update an existing review
 * @route  PUT /api/v1/reviews/:id
 * @access Private (owner)
 */
export const updateReview = asyncWrapper(async (req, res, next) => {
  const review = await ReviewsService.updateReview(
    req.user._id,
    req.params.id,
    req.body.review,
    req.body.message
  );
  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    data: review,
  });
});

/**
 * @desc   Delete a review
 * @route  DELETE /api/v1/reviews/:id
 * @access Private (owner or admin)
 */
export const deleteReview = asyncWrapper(async (req, res, next) => {
  const review = await ReviewsService.deleteReview(req.user._id, req.params.id);
  res.status(200).json({
    success: true,
    message: "Review removed successfully",
  });
});
