import asyncWrapper from "../middlewares/async-wrapper.js";
import "../models/category.model.js";
import "../models/sub-category.model.js";
import ProductService from "../services/product.service.js";

class ProductController {
    #ProductService

    constructor(ProductService, Product) {
        this.#ProductService = ProductService;
    }

    wrap(fn) {
        return asyncWrapper(fn.bind(this))
    }

    async createProduct(req, res, next) {
        const product = await this.#ProductService.create(req.body);
        res.status(201).json({
            status: "success", message: "Product created successfully", data: product
        })
    }

    async getAllProducts(req, res, next) {
        const {documents, totalDocuments, pagination} = await this.#ProductService.getAllProducts(req.query);
        res.status(200).json({
            status: "success", message: "Products retrieved successfully", length:totalDocuments, pagination,data: documents
        })
    }

    async updateProduct(req, res, next) {
        const {documents, totalDocuments, pagination} = await this.#ProductService.updateProduct(req.params.id, req.body)
        res.status(200).json({
            status: "success", message: "SubCategory updated successfully",length:totalDocuments, pagination,data: documents
        })
    }

    async deleteProduct(req, res, next) {
        await this.#ProductService.deleteProduct(req.params.id);
        res.status(200).json({
            status: "success", message: "Product deleted successfully"
        })
    }

    async getProductById(req, res, next) {
        const product = await this.#ProductService.getProductById(req.params.id)
        res.status(200).json({
            status: "success", message: "Product retrieved successfully", data: product
        })
    }

    async getProductsByCategory(req, res, next) {
        const products = await this.#ProductService.getProductsByCategory(req.params.id, req.query.page, req.query.limit)
        res.status(200).json({
            status: "success", message: "Products retrieved successfully", data: products
        })
    }

    async getProductsBySubCategory(req, res, next) {
        const products = await this.#ProductService.getProductsBySubCategory(req.params.id, req.query.page, req.query.limit)
        res.status(200).json({
            status: "success", message: "Products retrieved successfully", data: products
        })
    }
}

export default new ProductController(ProductService);