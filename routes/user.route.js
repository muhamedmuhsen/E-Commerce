import express from "express";
import allowed from "../middlewares/is-allowed.js";
import UserController from "../controllers/user.controller.js";
import {
    createUserValidator,
    deleteUserValidator,
    getUserValidator,
    updateUserValidator,
    changeUserPasswordValidator,
    updateLoggedUserValidator,
} from "../validators/user.validator.js";
import authenticateJWT from "../middlewares/authenticate-jwt.js";

const router = express.Router({mergeParams: true});

router.use(authenticateJWT);

router.get("/get-me", UserController.getLoggedUser, UserController.wrap(UserController.getUser))
router.delete("/deactivate-me", UserController.getLoggedUser, UserController.wrap(UserController.deactivateUser))

router.put("/update-me", updateLoggedUserValidator, UserController.getLoggedUser, UserController.wrap(UserController.updateLoggedUserData))
router.patch("/update-my-password", UserController.getLoggedUser, changeUserPasswordValidator, UserController.wrap(UserController.changePassword))

// Protected Routes
router.use(allowed("admin", "manager"));

router.route("/").get(UserController.wrap(UserController.getUsers)).post(createUserValidator, UserController.wrap(UserController.createUser))

router
    .route("/:id")
    .get(getUserValidator, UserController.wrap(UserController.getUser))
    .put(updateUserValidator, UserController.wrap(UserController.updateUser))
    .delete(deleteUserValidator, UserController.wrap(UserController.deleteUser))

export default router;
