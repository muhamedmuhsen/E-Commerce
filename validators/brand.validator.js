import validateRequest from "../middlewares/validate-request.js";
import {atLeastOneField, mongoId, name} from "./common.validator.js";

// TODO(Validate Image Brand)

const createBrandValidator = [name("Brand").notEmpty().withMessage("Brand name is required"), validateRequest,];

const updateBrandValidator = [mongoId(), atLeastOneField("name", "image"), name("Brand"), validateRequest,];

const deleteBrandValidator = [mongoId(), validateRequest];

const getSpecificBrandValidator = [mongoId(), validateRequest];

export {
    createBrandValidator, deleteBrandValidator, getSpecificBrandValidator, updateBrandValidator,
};
