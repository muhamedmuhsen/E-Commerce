import express from "express";

import {
  createBrand,
  deleteBrand,
  getAllBrand,
  getSpecificBrand,
  updateBrand
} from "../controllers/brand.controller.js";

import {
  createBrandValidator,
  deleteBrandValidator,
  getSpecificBrandValidator,
  updateBrandValidator
} from '../utils/validators/validateBrandRequest.js';
const router = express.Router();

router.route("/").get(getAllBrand).post(createBrandValidator,createBrand);

router
  .route("/:id")
  .put(updateBrandValidator,updateBrand)
  .delete(deleteBrandValidator,deleteBrand)
  .get(getSpecificBrandValidator,getSpecificBrand);

export default router;
