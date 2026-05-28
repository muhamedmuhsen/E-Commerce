import express from "express";
import authenticateJWT from "../middlewares/authenticate-jwt.js";
import isAllowed from "../middlewares/is-allowed.js";
import CouponController from "../controllers/coupon.controller.js";
import {
    createCouponValidator, deleteCouponValidator, getSpecificCouponValidator, updateCouponValidator,
} from "../validators/coupon.validator.js";

const router = express.Router();

router.use(authenticateJWT, isAllowed("admin"));

router.route("/").get(CouponController.wrap(CouponController.getAllCoupons)).post(createCouponValidator, CouponController.wrap(CouponController.createCoupon));

router
    .route("/:id")
    .get(getSpecificCouponValidator, CouponController.wrap(CouponController.getCouponById))
    .put(updateCouponValidator, CouponController.wrap(CouponController.updateCoupon))
    .delete(deleteCouponValidator, CouponController.wrap(CouponController.deleteCoupon));

export default router;
