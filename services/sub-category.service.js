import SubCategory from "../models/sub-category.model.js";
import SubCategoryModel from "../models/sub-category.model.js";
import CategoryModel from "../models/category.model.js";
import {NotFoundError} from "../utils/api-errors.js";
import baseService from "./base.service.js";

class SubCategoryService {
    #baseService;
    #subCategory;

    constructor(baseService, subCategory) {
        this.#baseService = baseService;
        this.#subCategory = subCategory;
    }

    async getAllSubCategories(query) {
        return this.#baseService.getAll(this.#subCategory, query);
    }

    async getSubCategory(id) {
        return this.#baseService.getOne(this.#subCategory, id);
    }

    async createSubCategory(data) {
        const {category} = data;
        if (!(await CategoryModel.exists({_id: category}))) throw new NotFoundError("Category not found");

        return this.#baseService.createOne(this.#subCategory, data);
    }

    async updateSubCategory(id, data) {
        const {category} = data;

        if (!(await CategoryModel.exists(category))) throw new NotFoundError("Category not found");

        return this.#baseService.updateOne(this.#subCategory, id, data);
    }

    async deleteSubCategory(id) {
        return this.#baseService.deleteOne(this.#subCategory, id);
    }

}


export default new SubCategoryService(baseService, SubCategory);