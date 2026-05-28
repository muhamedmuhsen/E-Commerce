import BaseService from "./base.service.js";
import CouponModel from "../models/coupon.model.js";
import {BadRequestError} from "../utils/api-errors.js";

class CouponService {
    #BaseService;
    #CouponModel;

    constructor(BaseService, CouponModel) {
        this.#BaseService = BaseService;
        this.#CouponModel = CouponModel;
    }

    async getAllCoupons(query) {
        return this.#BaseService.getAll(this.#CouponModel, query)
    }

    async getCouponById(id) {
        return this.#BaseService.getOne(this.#CouponModel, id)
    }

    async createCoupon(data) {
        if(await this.#CouponModel.exists(data.name))
            throw new BadRequestError("Coupon already exists");

        return this.#BaseService.createOne(this.#CouponModel, data);
    }

    async updateCoupon(id, data) {
        return this.#BaseService.updateOne(this.#CouponModel, id, data);
    }

    async deleteCoupon(id) {
        return this.#BaseService.deleteOne(this.#CouponModel, id);
    }

}

export default new CouponService(BaseService, CouponModel);