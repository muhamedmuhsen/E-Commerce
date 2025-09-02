import express from "express";

import {
  createBrand,
  deleteBrand,
  getAllBrand,
  getSpecificBrand,
  updateBrand,
} from "../controllers/brand.controller.js";

import {
  createBrandValidator,
  deleteBrandValidator,
  getSpecificBrandValidator,
  updateBrandValidator,
} from "../validators/brand.validator.js";
import authenticateJWT from "../middlewares/authenticate-jwt.js";
const router = express.Router();

router
  .route("/")
  .get(getAllBrand)
  .post(createBrandValidator, authenticateJWT, createBrand);

router
  .route("/:id")
  .put(updateBrandValidator, authenticateJWT, updateBrand)
  .delete(deleteBrandValidator, authenticateJWT, deleteBrand)
  .get(getSpecificBrandValidator, getSpecificBrand);

export default router;
