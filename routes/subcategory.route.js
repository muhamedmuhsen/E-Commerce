import express from "express";

import {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSpecificSubCategory,
  setCategoryIdToBody,
  setFilterObject,
  updateSubCategory,
} from "../controllers/subcategory.controller.js";
import {
  createSubCategoryValidator,
  deleteSubCategoryValidator,
  getSpecificSubCategoryValidator,
  updateSubCategoryValidator,
} from "../validators/validateSubCategoryRequest.js"; // Fixed filename

// mergeParams allow us access parameters on other routes
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(setFilterObject, getAllSubCategories)
  .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory);
router
  .route("/:id")
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory)
  .get(getSpecificSubCategoryValidator, getSpecificSubCategory);

export default router;
