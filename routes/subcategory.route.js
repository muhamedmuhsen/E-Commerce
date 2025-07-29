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
import authenticateJWT from "../middlewares/authenticateJWT.js";

// mergeParams allow us access parameters on other routes
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(setFilterObject, getAllSubCategories)
  .post(
    setCategoryIdToBody,
    createSubCategoryValidator,
    authenticateJWT,
    createSubCategory
  );
router
  .route("/:id")
  .put(updateSubCategoryValidator, authenticateJWT, updateSubCategory)
  .delete(deleteSubCategoryValidator, authenticateJWT, deleteSubCategory)
  .get(
    getSpecificSubCategoryValidator,
    authenticateJWT,
    getSpecificSubCategory
  );

export default router;
