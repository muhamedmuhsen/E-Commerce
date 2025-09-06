import BaseService from "../services/base.service.js";
import BrandModel from "../models/brand.model.js";
import asyncWrapper from "../middlewares/async-wrapper.js";

// TODO(handle image)
class BrandController {
    #BaseService
    #Brand
    constructor (BaseService, Brand) {
        this.#BaseService = BaseService;
        this.#Brand = Brand;
    }

    wrap(fn){
        return asyncWrapper(fn.bind(this));
    }
    async getAllBrands(query){
        return await this.#BaseService.getAll(this.#Brand, query);
    }

    async getBrandById(id){
        return await this.#BaseService.getOne(this.#Brand,id);
    }
    async createBrand(data){
        return await this.#BaseService.create(this.#Brand, data);
    }

    async updateBrand(id, data){
        return await this.#BaseService.update(this.#Brand,id,data);
    }

    async deleteBrand(id){
        return await this.#BaseService.delete(this.#Brand,id);
    }
}

export default new BrandController(BaseService, BrandModel);