import express from "express";
import ProductController from "../controllers/product.controller.js";
import {
  createProductValidator,
  deleteProductValidator,
  getSpecificProductValidator,
  updateProductValidator,
} from "../validators/product.validator.js";
import authenticateJWT from "../middlewares/authenticate-jwt.js";
import { upload } from "../config/multer.js";
import { normalizeBody } from "../middlewares/normalize-body.js";
import isAllowed from "../middlewares/is-allowed.js";

const router = express.Router({ mergeParams: true });


router.use(authenticateJWT);

router
  .route("/")
  .get(ProductController.wrap(ProductController.getAllProducts))
  .post(
    isAllowed("admin"),
    upload.fields([
      { name: "imageCover", maxCount: 1 },
      { name: "image", maxCount: 6 },
    ]),
    normalizeBody,
    createProductValidator,
    ProductController.wrap(ProductController.createProduct)
  );

router
  .route("/:id")
  .put(
    isAllowed("admin"),
    upload.fields([
      { name: "imageCover", maxCount: 1 },
      { name: "image", maxCount: 6 },
    ]),
    normalizeBody,
    updateProductValidator,
    ProductController.wrap(ProductController.updateProduct)
  )
  .delete(
    isAllowed("admin"),
    deleteProductValidator,
    ProductController.wrap(ProductController.deleteProduct)
  )
  .get(
    getSpecificProductValidator,
    ProductController.wrap(ProductController.getProductById)
  );

// getProductsBySubCategory
export default router;
