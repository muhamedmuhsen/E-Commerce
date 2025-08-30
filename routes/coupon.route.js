import express from "express";
import authenticateJWT from "../middlewares/authenticate-jwt.js";
import isAllowed from "../middlewares/is-allowed.js";
import {
  createCoupon,
  deleteCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
} from "../controllers/coupon.controller.js";
import {
  createCouponValidator,
  deleteCouponValidator,
  getSpecificCouponValidator,
  updateCouponValidator,
} from "../validators/coupon.validator.js";
const router = express.Router();

router.use(authenticateJWT, isAllowed("admin"));

router.route("/").get(getCoupons).post(createCouponValidator, createCoupon);

router
  .route("/:id")
  .get(getSpecificCouponValidator, getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

export default router;
