import express from "express";
import ProductController from "../controllers/product.controller.js";
import {
    createProductValidator, deleteProductValidator, getSpecificProductValidator, updateProductValidator,
} from "../validators/product.validator.js";
import authenticateJWT from "../middlewares/authenticate-jwt.js";

const router = express.Router({mergeParams: true});

router
    .route("/")
    .get(ProductController.wrap(ProductController.getAllProducts))
    .post(createProductValidator, authenticateJWT, ProductController.wrap(ProductController.createProduct));

router
    .route("/:id")
    .put(updateProductValidator, authenticateJWT, ProductController.wrap(ProductController.updateProduct))
    .delete(deleteProductValidator, authenticateJWT, ProductController.wrap(ProductController.deleteProduct))
    .get(getSpecificProductValidator, ProductController.wrap(ProductController.getProductById))

// getProductsBySubCategory
export default router;
