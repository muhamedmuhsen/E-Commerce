import validateRequest from "../middlewares/validate-request.js";
import {email, name, password, passwordConfirm} from "./common.validator.js";
import {check} from "express-validator";

export const registerValidator = [name("username").notEmpty().withMessage("Username is required"), email(), password(), passwordConfirm(), validateRequest,];

export const loginValidator = [email(), password(), validateRequest];

export const forgetPasswordValidator = [email(), validateRequest]

export const verifyResetCodeValidator = [check("resetCode").notEmpty().withMessage("Reset Code can't be empty").isString().withMessage("Reset Code must be String").isLength({
    min: 6, max: 6
}).withMessage("Reset Code must be 6 Numbers"), validateRequest]

export const resetPasswordValidator = [email(), password("newPassword"), passwordConfirm(), validateRequest];
