import CategoryModel from "../models/category.model.js";
import asyncWrapper from "../middlewares/async-wrapper.js";
import BaseService from "../services/base.service.js";

class CategoryController {
    #BaseService;
    #CategoryModel;

    constructor(BaseService, CategoryModel) {
        this.#BaseService = BaseService;
        this.#CategoryModel = CategoryModel;
    }

    wrap(fn){
        return asyncWrapper(fn.bind(this));
    }
    async getAllCategories(query) {
        return this.#BaseService.getAll(this.#CategoryModel, query)
    }

    async getCategory(id) {
        return this.#BaseService.getOne(id)
    }


    async createCategory(data) {
        return this.#BaseService.create(this.#CategoryModel, data);
    }

    async updateCategory(id, data) {
        return this.#BaseService.update(id, data);
    }

    async deleteCategory(id) {
        return this.#BaseService.delete(id);
    }

}

export default new CategoryController(BaseService, CategoryModel);