import validateRequest from "../middlewares/validate-request.js";
import { email, name, password, passwordConfirm } from "./common.validator.js";

const registerValidator = [
  name("username").notEmpty().withMessage("Username is required"),
  email(),
  password(),
  passwordConfirm(),
  validateRequest,
];

const loginValidator = [email(), password(), validateRequest];

export { registerValidator, loginValidator };
