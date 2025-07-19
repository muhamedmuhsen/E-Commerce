import express from "express";

import {
  createBrand,
  deleteBrand,
  getAllBrand,
  getSpecificBrand,
  updateBrand,
} from "../controllers/brand.controller.js";

const router = express.Router();

router.route("/").get(getAllBrand).post(createBrand);

router
  .route("/:id")
  .put(updateBrand)
  .delete(deleteBrand)
  .get(getSpecificBrand);

export default router;
