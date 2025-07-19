import express from "express";

import {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSpecificSubCategory,
  updateSubCategory,
} from "../controllers/subcategory.controller.js";
import {
  createSubCategoryValidator,
  deleteSubCategoryValidator,
  getAllSubCategoriesValidator,
  getSpecificSubCategoryValidator,
  updateSubCategoryValidator,
} from "../utils/validators/validateSubCateogryRequest.js";

const router = express.Router();

router
  .route("/")
  .get(getAllSubCategoriesValidator, getAllSubCategories)
  .post(createSubCategoryValidator, createSubCategory);
router
  .route("/:id")
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory)
  .get(getSpecificSubCategoryValidator, getSpecificSubCategory);

export default router;
