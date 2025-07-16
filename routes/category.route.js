import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.route("/").get(getAllCategories).post(createCategory);
router
  .route("/:id")
  .update(updateCategory)
  .delete(deleteCategory)
  .get(getSpecificCategory);

export default router;
