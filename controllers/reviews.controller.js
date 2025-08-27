import asyncWrapper from "../middlewares/asyncWrapper.js";
import ReviewsService from "../services/reviews.service.js";

const reviewsService = new ReviewsService();

export const addReview = asyncWrapper(async (req, res, next) => {
  const review = await reviewsService.addReview(
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

export const getAllReviewsOfProduct = asyncWrapper(async (req, res, next) => {
  const { reviews, totalReviews, pagination } =
    await reviewsService.getAllReviewsOfProduct(req.params.id, req.query);

  res.status(200).json({
    success: true,
    totalReviews,
    pagination,
    message: "Reviews retrived successfully",
    data: reviews,
  });
});

export const getReviewOfProduct = asyncWrapper(async (req, res, next) => {
  const review = await reviewsService.getReviewOfProduct(
    req.user._id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Review retrieved successfully",
    data: review,
  });
});

export const updateReview = asyncWrapper(async (req, res, next) => {
  const review = await reviewsService.updateReview(
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

export const deleteReview = asyncWrapper(async (req, res, next) => {
  const review = await reviewsService.deleteReview(req.user._id, req.params.id);
  res.status(200).json({
    success: true,
    message: "Review removed successfully",
  });
});
