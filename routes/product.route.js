import express from "express";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSpecificProduct,
  updateProduct,
} from "../controllers/product.controller.js";

import {
  createProductValidator,
  deleteProductValidator,
  getSpecificProductValidator,
  updateProductValidator,
} from "../validators/validateProductRequest.js";
import authenticateJWT from "../middlewares/authenticateJWT.js";

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(createProductValidator, authenticateJWT, createProduct);

router
  .route("/:id")
  .put(updateProductValidator, authenticateJWT, updateProduct)
  .delete(deleteProductValidator, authenticateJWT, deleteProduct)
  .get(getSpecificProductValidator, getSpecificProduct);

export default router;
