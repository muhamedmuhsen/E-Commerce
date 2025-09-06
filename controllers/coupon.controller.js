import asyncWrapper from "../middlewares/async-wrapper.js";
import BaseService from "../services/base.service.js";
import CouponModel from "../models/coupon.model.js";

class CouponController {
    #BaseService;
    #CouponModel;

    constructor(BaseService, CouponModel) {
        this.#BaseService = BaseService;
        this.#CouponModel = CouponModel;
    }

    wrap(fn) {
        return asyncWrapper(fn.bind(this));
    }

    async getAllCoupons(query) {
        return this.#BaseService.getAll(this.#CouponModel, query)
    }

    async getCoupon(id) {
        return this.#BaseService.getOne(this.#CouponModel, id)
    }


    async createCoupon(data) {
        return this.#BaseService.create(this.#CouponModel, data);
    }

    async updateCoupon(id, data) {
        return this.#BaseService.update(this.#CouponModel, id, data);
    }

    async deleteCoupon(id) {
        return this.#BaseService.delete(this.#CouponModel, id);
    }

}

export default new CouponController(BaseService, CouponModel);