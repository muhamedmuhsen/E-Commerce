import {ApiError, BadRequestError, NotFoundError} from "../utils/api-errors.js";
import Product from "../models/product.model.js";
import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/sub-category.model.js";
import BaseService from "./base.service.js";
import SubCategory from "../models/sub-category.model.js";
import {category} from "../validators/common.validator.js";


class ProductService {
    #BaseService
    #Product

    constructor(BaseService, Product) {
        this.#BaseService = BaseService;
        this.#Product = Product;
    }

    async createProduct(data) {
        if (!await CategoryModel.exists({_id: data.category})) throw new NotFoundError("Category not found");

        const subcategoryIds = data.subcategories;

        const existingSubcategories = await SubCategory.find({_id: {$in: subcategoryIds}})

        if (existingSubcategories.length !== subcategoryIds.length) {
            const foundIds = existingSubcategories.map(sub => sub._id.toString());
            const missingIds = foundIds.filter(id => !foundIds.includes(id));

            throw new NotFoundError(`SubCategories not found: ${missingIds.join(', ')}`);
        }

        const invalidSubcategories = existingSubcategories.filter(sub => sub.category !== data.category)

        if(invalidSubcategories.length > 0) {
            throw new BadRequestError(`SubCategory ${invalidSubcategories.join(', ')} doesn't belong to category ${data.category}`);
        }

        return await this.#BaseService.createOne(this.#Product, data);
    }

    async getAllProducts(query) {
        const {documents, totalDocuments, pagination} = await this.#BaseService.getAll(this.#Product, query);
        if (!documents) throw new NotFoundError("Couldn't get all products");
        return {documents, totalDocuments, pagination};
    }

    async updateProduct(id, data) {
        return await this.#BaseService.updateOne(this.#Product, id, data)
    }

    async deleteProduct(id) {
        return await this.#BaseService.deleteOne(this.#Product, id);
    }

    async getProductById(id) {
        return await this.#BaseService.getOne(this.#Product, id)
    }

    async getProductsByCategory(query) {

        if (!await CategoryModel.exists({_id: query.category})) throw new NotFoundError("Category not found");

        const products = await this.#BaseService.getAll(this.#Product, query);

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

    setRequestQuery(req, res, next){
        req.query = {page:page, limit:limit, category:categoryId};
        next()
    }
}

export default new ProductService(BaseService, Product);