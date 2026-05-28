import validateRequest from "../middlewares/validate-request.js";
import { check } from "express-validator";
import { mongoId } from "./common.validator.js";

const checkReview = () =>
  check("review")
    .notEmpty()
    .withMessage("Review is required")
    .isIn([1, 2, 3, 4, 5])
    .withMessage("Review must be a rating between 1 and 5");

const checkMessage = () =>
  check("message")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Message cannot exceed 500 characters")
    .trim();

export const addReviewValidator = [
  mongoId(),
  checkReview(),
  checkMessage(),
  validateRequest,
];

export const getReviewOfProductValidator = [mongoId(), validateRequest];

export const updateReviewValidator = [
  mongoId(),
  checkReview(),
  checkMessage(),
  validateRequest,
];

export const deleteReviewValidator = [mongoId(), validateRequest];

export const getAllReviewsOfProductValidator = [mongoId(), validateRequest];
