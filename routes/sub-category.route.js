import express from "express";

import {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSpecificSubCategory,
  setCategoryIdToBody,
  setFilterObject,
  updateSubCategory,
} from "../controllers/sub-category.controller.js";
import {
  createSubCategoryValidator,
  deleteSubCategoryValidator,
  getSpecificSubCategoryValidator,
  updateSubCategoryValidator,
} from "../validators/sub-category.validator.js";
import authenticateJWT from "../middlewares/authenticate-jwt.js";

// mergeParams allow us access parameters on other routes
const router = express.Router({ mergeParams: true });

router.get("/", setFilterObject, getAllSubCategories);

router.use(authenticateJWT);

router.post(
  "/",
  setCategoryIdToBody,
  createSubCategoryValidator,
  createSubCategory
);
router
  .route("/:id")
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory)
  .get(getSpecificSubCategoryValidator, getSpecificSubCategory);

export default router;
