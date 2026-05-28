import express from "express";
import subCategoryRoute from "./sub-category.route.js";
import CategoryController from "../controllers/category.controller.js";
import {
  createCategoryValidator,
  deleteCategoryValidator,
  getSpecificCategoryValidator,
  updateCategoryValidator,
} from "../validators/category.validator.js";
import authenticateJWT from "../middlewares/authenticate-jwt.js";
import ProductRoute from "./product.route.js";
import isAllowed from "../middlewares/is-allowed.js";
import { upload } from "../config/multer.js";
import { normalizeBody } from "../middlewares/normalize-body.js";

const router = express.Router();

router.use(authenticateJWT);

router
  .route("/")
  .get(CategoryController.wrap(CategoryController.getAllCategories))
  .post(
    isAllowed("admin"),
    upload.single("image"),
    normalizeBody,
    createCategoryValidator,
    CategoryController.wrap(CategoryController.createCategory)
  );
router
  .route("/:id")
  .put(
    isAllowed("admin"),
    upload.single("image"),
    normalizeBody,
    updateCategoryValidator,
    CategoryController.wrap(CategoryController.updateCategory)
  )
  .delete(
    isAllowed("admin"),
    deleteCategoryValidator,
    CategoryController.wrap(CategoryController.deleteCategory)
  )
  .get(
    getSpecificCategoryValidator,
    CategoryController.wrap(CategoryController.getCategory)
  );

router.use("/:id/subcategories", subCategoryRoute);
router.use("/:id/products", ProductRoute);

export default router;
