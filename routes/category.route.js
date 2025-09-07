import express from "express";
import subCategoryRoute from "./sub-category.route.js";
import CategoryController from "../controllers/category.controller.js";
import {
    createCategoryValidator, deleteCategoryValidator, getSpecificCategoryValidator, updateCategoryValidator,
} from "../validators/category.validator.js";
import authenticateJWT from "../middlewares/authenticate-jwt.js";

const router = express.Router();


router
    .route("/")
    .get(CategoryController.wrap(CategoryController.getAllCategories))
    .post(authenticateJWT,createCategoryValidator, CategoryController.wrap(CategoryController.createCategory))
router
    .route("/:id")
    .put(updateCategoryValidator, authenticateJWT, CategoryController.wrap(CategoryController.updateCategory))
    .delete(deleteCategoryValidator, authenticateJWT, CategoryController.wrap(CategoryController.deleteCategory))
    .get(getSpecificCategoryValidator, CategoryController.wrap(CategoryController.getCategory))

router.use("/:id/subcategories", subCategoryRoute);

export default router;
