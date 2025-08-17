import validateRequest from "../middlewares/validateRequest.js";
import { email, name, password, passwordConfirm } from "./commonValidators.js";

const registerValidator = [
  name("username").notEmpty().withMessage("Username is required"),
  email(),
  password(),
  passwordConfirm(),
  validateRequest,
];

const loginValidator = [email(), password(), validateRequest];

export { registerValidator, loginValidator };
