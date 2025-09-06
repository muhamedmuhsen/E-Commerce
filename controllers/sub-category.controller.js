import asyncWrapper from "../middlewares/async-wrapper.js";
import SubCategory from "../models/sub-category.model.js";
import SubCategoryService from "../services/sub-category.service.js";

class SubCategoryController {
    #SubCategoryService;
    #SubCategory;

    constructor(SubCategoryService, SubCategory) {
        this.#SubCategoryService = SubCategoryService;
        this.#SubCategory = SubCategory;
    }

    wrap(fn) {
        return asyncWrapper(fn.bind(this))
    }

    async createSubCategory(req, res, next) {
        const subcategory = await this.#SubCategoryService.createSubCategory(req.body)

        res.status(201).json({
            status: "success", message: "SubCategory created successfully", data: subcategory
        })
    }

    async getSubCategory(req, res, next) {
        const subcategory = await this.#SubCategoryService.getSubCategory(req.params.id);

        res.status(200).json({
            status: "success", message: "SubCategory retrieved successfully", data: subcategory
        })
    }

    async getAllSubCategories(req, res, next) {

        const subcategories = await this.#SubCategoryService.getAllSubCategories(req.query)
        res.status(200).json({
            status: "success", message: "All SubCategories retrieved successfully", data: subcategories
        })
    }

    async updateSubCategory(req, res, next) {
        const subcategory = await this.#SubCategoryService.updateSubCategory(req.params.id, req.body);
        res.status(200).json({
            status: "success", message: "SubCategory updated successfully", data: subcategory
        })
    }

    async deleteSubCategory(req, res, next) {
        await this.#SubCategoryService.deleteSubCategory(req.params.id);
        res.status(200).json({
            status: "success", message: "SubCategory deleted successfully"
        })
    }

    async getSubCategoriesOfCategory(req, res, next) {
        const subcategories = await this.#SubCategoryService.getSubCategoriesOfCategory(req.params.id);
        res.status(200).json({
            status: "success", message: "SubCategories retrieved successfully", data: subcategories
        })
    }

    async createSubCategoryUnderCategory(req, res, next) {
        const subcategory = await this.#SubCategoryService.createSubCategoryUnderCategory(req.params.id, req.body);
        res.status(200).json({
            status: "success", message: "SubCategory created successfully", data: subcategory
        })
    }


}

const setCategoryIdToBody = (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.id;
    next();
};

const setFilterObject = (req, res, next) => {
    let filterObject = {};

    if (req.params.id) filterObject = {category: req.params.id};

    req.filterObject = filterObject;

    next();
};

export {setCategoryIdToBody, setFilterObject};
export default new SubCategoryController(SubCategoryService, SubCategory);
