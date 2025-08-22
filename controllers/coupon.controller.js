import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlersFactory.js";
import Coupon from "../models/coupon.model.js";

/**
 * @desc   Get all coupons with pagination
 * @route  GET /api/v1/coupons
 * @access Private
*/
export const getCoupons = getAll(Coupon);

/**
 * @desc   Get single coupon by ID
 * @route  GET /api/v1/coupons/:id
 * @access Private
 */
export const getCoupon = getOne(Coupon);

/**
 * @desc   Create new coupon
 * @route  POST /api/v1/coupons
 * @access Private
 */
export const createCoupon = createOne(Coupon);

/**
 * @desc   Update coupon by ID
 * @route  PUT /api/v1/coupons/:id
 * @access Private
 */
export const updateCoupon = updateOne(Coupon);

/**
 * @desc   Delete coupon by ID
 * @route  DELETE /api/v1/coupons/:id
 * @access Private
 */
export const deleteCoupon = deleteOne(Coupon);
