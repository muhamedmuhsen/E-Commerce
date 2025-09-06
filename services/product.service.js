import {ApiError, NotFoundError} from "../utils/api-errors.js";
import Product from "../models/product.model.js";
import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/sub-category.model.js";
import BaseService from "./base.service.js";


class ProductService {
    #BaseService
    #Product

    constructor(BaseService, Product) {
        this.#BaseService = BaseService;
        this.#Product = Product;
    }

    async createProduct(data) {
        return await this.#BaseService.createOne(this.#Product, data);
    }

    async getAllProducts(query) {
        const {documents, totalDocuments, pagination} = await this.#BaseService.getAll(this.#Product, query);
        if (!documents) throw new NotFoundError("Couldn't get all products");
        return {documents, totalDocuments, pagination};
    }

    async updateProduct(id, data) {
        return await this.#BaseService.updateOne(this.#Product,id, data)
    }

    async deleteProduct(id) {
        return await this.#BaseService.deleteOne(this.#Product,id);
    }

    async getProductById(id) {
        return await this.#BaseService.getOne(this.#Product,id)
    }

    async getProductsByCategory(categoryId, page = 1, limit = 10) {

        if (!await CategoryModel.exists(categoryId)) throw new NotFoundError("Category not found");

        const offset = (page - 1) * limit;

        const products = await Product.find({category: categoryId})
            .skip(offset)
            .limit(limit)
            .lean();

        if (!products || !products.length) throw new NotFoundError("it seems this category doesn't have products");

        return products
    };


    async getProductsBySubcategory(subcategoryId, page = 1, limit = 10) {

        if (!await SubCategoryModel.exists(categoryId)) throw new NotFoundError("SubCategory not found");
        const offset = (page - 1) * limit;

        const products = await Product.find({subcategories: subcategoryId})
            .skip(offset)
            .limit(limit)
            .lean();

        if (!products || !products.length) throw new NotFoundError("it seems this subcategory doesn't have products");

        return products

    };
}

export default new ProductService(BaseService, Product);