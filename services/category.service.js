import CategoryModel from "../models/category.model.js";
import {ApiError, NotFoundError} from "../utils/api-errors.js";
import BaseService from "./base.service.js";


class CategoryService {
    #CategoryModel;
    #BaseService;

    constructor(BaseService, categoryModel) {
        this.#BaseService = BaseService;
        this.#CategoryModel = CategoryModel;
    }

    async getAllCategories(query) {
        const category = await this.#BaseService.getAll(this.#CategoryModel, query);
        return category ? category : [];
    }

    async getCategoryById(id) {
        const category = await this.#BaseService.getOne(this.#CategoryModel, id);
        if (!category) throw new NotFoundError("Category not found");
        return category;
    }

    async createCategory(data) {
        try {

            return await this.#BaseService.createOne(this.#CategoryModel, data);
        } catch (error) {
            throw new ApiError(error.message);
        }
    }

    async updateCategory(id, data) {
        const category = await this.#BaseService.updateOne(this.#CategoryModel, id, data);
        if (!category) throw new NotFoundError("Category not found");
        return category;
    }

    async deleteCategory(id) {
        const category = await this.#BaseService.deleteOne(this.#CategoryModel,id);
        if (!category) throw new NotFoundError("Category not found");
        return category;
    }

}

export default new CategoryService(BaseService, CategoryModel);