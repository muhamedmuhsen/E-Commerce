import validateRequest from "../middlewares/validate-request.js";
import {mongoId, name, category, atLeastOneField} from "./common.validator.js";
import Category from "../models/category.model.js";
import {NotFoundError} from "../utils/api-errors.js";

const categoryValidator = category().optional().custom(async (val, {req}) => {
    const parentCategory = await Category.findById(body.category);
    if (!parentCategory) {
        throw new NotFoundError("Category not found");
    }
})

const createSubCategoryValidator = [name("SubCategory").notEmpty(), categoryValidator.notEmpty().withMessage("Category must be belong to category"), validateRequest,];

const updateSubCategoryValidator = [mongoId(), atLeastOneField(["name", "category"]), name("SubCategory").optional(), categoryValidator, validateRequest,];

const getSpecificSubCategoryValidator = [mongoId(), validateRequest];

const deleteSubCategoryValidator = [mongoId(), validateRequest];

export {
    createSubCategoryValidator, deleteSubCategoryValidator, updateSubCategoryValidator, getSpecificSubCategoryValidator,
};
