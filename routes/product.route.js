import express from "express";

import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getSpecificProduct,
  updateProduct,
} from "../controllers/Product.controller.js";

import {
  createProductValidator,
  deleteProductValidator,
  getAllProductValidator,
  getSpecificProductValidtor,
  updateProductValidator,
} from "../utils/validators/validateProductRequest.js";
const router = express.Router();

router
  .route("/")
  .get(getAllProductValidator, getAllProduct)
  .post(createProductValidator, createProduct);

router
  .route("/:id")
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct)
  .get(getSpecificProductValidtor, getSpecificProduct);

export default router;
