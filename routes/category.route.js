import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import {
  categorySchema,
  validateRequest,
} from "../middlewares/validateRequest.js";

const router = express.Router();

router
  .route("/")
  .get(getAllCategories)
  .post(validateRequest(categorySchema), createCategory);
router
  .route("/:id")
  .put(updateCategory)
  .delete(deleteCategory)
  .get(getSpecificCategory);

export default router;
