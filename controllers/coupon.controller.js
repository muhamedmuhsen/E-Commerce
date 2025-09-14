import asyncWrapper from "../middlewares/async-wrapper.js";
import CouponService from "../services/coupon.service.js";


class CouponController {
    #CouponService;

    constructor(CouponService) {
        this.#CouponService = CouponService;
    }

    wrap(fn) {
        return asyncWrapper(fn.bind(this));
    }

    async getAllCoupons(req, res) {
        const {documents, totalDocuments, pagination} = await this.#CouponService.getAllCoupons(req.query)
        res.status(200).json({
            status: "success",
            message: "Coupons retrieved successfully",
            length: totalDocuments,
            pagination,
            data: documents
        })
    }

    async getCouponById(req, res) {
        const coupon = await this.#CouponService.getCouponById(req.params.id)
        res.status(200).json({
            status: "success", message: "Coupon retrieved successfully", data: coupon
        })
    }


    async createCoupon(req, res) {
        const coupon = await this.#CouponService.createCoupon(req.body);
        res.status(201).json({
            status: "success", message: "Coupon created successfully", data: coupon
        })
    }

    async updateCoupon(req, res) {
        const coupon = await this.#CouponService.updateCoupon(req.params.id, req.body);
        res.status(200).json({
            status: "success", message: "Coupon updated successfully", data: coupon
        })
    }

    async deleteCoupon(req, res) {
        await this.#CouponService.deleteCoupon(req.params.id);
        res.status(200).json({
            status: "success", message: "Coupon deleted successfully"
        })
    }

}


export default new CouponController(CouponService);