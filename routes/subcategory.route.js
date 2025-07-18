import express from "express";

import {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSpecificSubCategory,
  updateSubCategory,
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
  .get(getAllCategoriesValidator, getAllSubCategories)
  .post(createCategoryValidator, createSubCategory);
router
  .route("/:id")
  .put(updateCategoryValidator, updateSubCategory)
  .delete(deleteCategoryValidator, deleteSubCategory)
  .get(getSpecificCategoryValidator, getSpecificSubCategory);

export default router;
