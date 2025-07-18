import express from "express";

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import {
  createSubCategoryOnCategory,
  getSubCategoryofSpecificCategory,
} from "../controllers/subcategory.controller.js";
import {
  createCategoryValidator,
  deleteCategoryValidator,
  getAllCategoriesValidator,
  getSpecificCategoryValidator,
  updateCategoryValidator,
} from "../middlewares/validateRequest.js";

const router = express.Router();

router
  .route("/")
  .get(getAllCategoriesValidator, getAllCategories)
  .post(createCategoryValidator, createCategory);
router
  .route("/:id")
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory)
  .get(getSpecificCategoryValidator, getSpecificCategory);

router
  .route("/:id/subcategories")
  .get(getSubCategoryofSpecificCategory)
  .post(createSubCategoryOnCategory);

export default router;
