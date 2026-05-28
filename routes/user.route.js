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
import { upload } from "../config/multer.js";
import { normalizeBody } from "../middlewares/normalize-body.js";

const router = express.Router({mergeParams: true});

router.use(authenticateJWT);

router.get("/get-me", UserController.getLoggedUser, UserController.wrap(UserController.getUser))
router.delete("/deactivate-me", UserController.getLoggedUser, UserController.wrap(UserController.deactivateUser))

router.put(
    "/update-me", 
    upload.single("image"), 
    normalizeBody, 
    updateLoggedUserValidator, 
    UserController.getLoggedUser, 
    UserController.wrap(UserController.updateLoggedUserData)
)
router.patch("/update-my-password", UserController.getLoggedUser, changeUserPasswordValidator, UserController.wrap(UserController.changePassword))

// Protected Routes
router.use(allowed("admin", "manager"));

router.route("/").get(UserController.wrap(UserController.getUsers)).post(
    upload.single("image"), 
    normalizeBody, 
    createUserValidator, 
    UserController.wrap(UserController.createUser)
)

router
    .route("/:id")
    .get(getUserValidator, UserController.wrap(UserController.getUser))
    .put(
        upload.single("image"), 
        normalizeBody, 
        updateUserValidator, 
        UserController.wrap(UserController.updateUser)
    )
    .delete(deleteUserValidator, UserController.wrap(UserController.deleteUser))

export default router;
