import validateRequest from "../middlewares/validate-request.js";
import {mongoId, name, category, atLeastOneField} from "./common.validator.js";


const createSubCategoryValidator = [mongoId("category"), name().notEmpty().withMessage("name is required"), validateRequest];

const updateSubCategoryValidator = [mongoId(), atLeastOneField(["name", "category"]), name().optional(), validateRequest,];

const getSpecificSubCategoryValidator = [mongoId(), validateRequest];

const deleteSubCategoryValidator = [mongoId(), validateRequest];

export {
    createSubCategoryValidator, deleteSubCategoryValidator, updateSubCategoryValidator, getSpecificSubCategoryValidator,
};
