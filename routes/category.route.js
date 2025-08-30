import express from "express";
import subCategoryRoute from "./sub-category.route.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import {
  createCategoryValidator,
  deleteCategoryValidator,
  getSpecificCategoryValidator,
  updateCategoryValidator,
} from "../validators/category.validator.js";
import authenticateJWT from "../middlewares/authenticate-jwt.js";

const router = express.Router();

router
  .route("/")
  .get(getAllCategories)
  .post(createCategoryValidator, authenticateJWT, createCategory);
router
  .route("/:id")
  .put(updateCategoryValidator, authenticateJWT, updateCategory)
  .delete(deleteCategoryValidator, authenticateJWT, deleteCategory)
  .get(getSpecificCategoryValidator, getSpecificCategory);

router.use("/:id/subcategories", subCategoryRoute);

export default router;
