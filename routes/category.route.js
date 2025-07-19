import express from "express";
import subCategoryRoute from './subcategory.route.js'
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
} from "../utils/validators/validateCategoryRequest.js"

const router = express.Router();

router
  .route("/")
  .get( getAllCategories)
  .post(createCategoryValidator, createCategory);
router
  .route("/:id")
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory)
  .get(getSpecificCategoryValidator, getSpecificCategory);


// TODO(add valdiator)
router.use("/:id/subcategories",subCategoryRoute)

export default router;
