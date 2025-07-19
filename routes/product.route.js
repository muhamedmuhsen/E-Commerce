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
} from "../utils/validators/validateProductRequest.js";
const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(createProductValidator, createProduct);

router
  .route("/:id")
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct)
  .get(getSpecificProductValidator, getSpecificProduct);

export default router;
