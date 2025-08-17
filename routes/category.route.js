import express from "express";
import subCategoryRoute from "./subcategory.route.js";
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
} from "../validators/validateCategoryRequest.js";
import authenticateJWT from "../middlewares/authenticateJWT.js";

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

// TODO(add valdiator)
// TODO(fix fetch subategories of category)
router.use("/:id/subcategories", subCategoryRoute);

export default router;
