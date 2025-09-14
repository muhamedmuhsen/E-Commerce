import BaseService from "./base.service.js";
import BrandModel from "../models/brand.model.js";

class BrandService {
  #BaseService;
  #BrandModel;

  constructor(BaseService, BrandModel) {
    this.#BaseService = BaseService;
    this.#BrandModel = BrandModel;
  }

  async getBrandById(id) {
    return await this.#BaseService.getOne(this.#BrandModel, id);
  }

  async getAllBrands(query) {
    return await this.#BaseService.getAll(this.#BrandModel, query);
  }

  async createBrand(brand) {
    return await this.#BaseService.createOne(this.#BrandModel, brand);
  }

  async updateBrand(id, brand) {
    return await this.#BaseService.updateOne(this.#BrandModel, id, brand);
  }

  async deleteBrand(id) {
    return await this.#BaseService.deleteOne(this.#BrandModel, id);
  }
}

export default new BrandService(BaseService, BrandModel);
