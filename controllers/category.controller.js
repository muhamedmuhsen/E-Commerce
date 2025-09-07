import asyncWrapper from "../middlewares/async-wrapper.js";
import CategoryService from "../services/category.service.js";

class CategoryController {
    #CategoryService;

    constructor(CategoryService) {
        this.#CategoryService = CategoryService;
    }

    wrap(fn) {
        return asyncWrapper(fn.bind(this));
    }

    async getAllCategories(req, res) {
        const {documents, totalDocuments, pagination} = await this.#CategoryService.getAllCategories(req.query)
        res.status(200).json({
            status: "success",
            message: "Categories retrieved successfully",
            length: totalDocuments,
            pagination,
            data: documents
        })
    }

    async getCategory(req, res) {
        const category = await this.#CategoryService.getCategoryById(req.params.id)
        res.status(200).json({
            status: "success", message: "Category retrieved successfully", data: category
        })
    }


    async createCategory(req, res) {
        console.log(req.body)
        const category = await this.#CategoryService.createCategory(req.body);
        res.status(201).json({
            status: "success", message: "Category created successfully", data: category
        })
    }

    async updateCategory(req, res) {
        const category = await this.#CategoryService.updateCategory(req.params.id, req.body);
        res.status(200).json({
            status: "success", message: "Category updated successfully", data: category
        })
    }

    async deleteCategory(req, res) {
        await this.#CategoryService.deleteCategory(req.params.id);
        res.status(200).json({
            status: "success", message: "Category deleted successfully"
        })
    }

}

export default new CategoryController(CategoryService);