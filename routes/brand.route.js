import express from "express";
import BrandController from "../controllers/brand.controller.js";
import {
  createBrandValidator,
  deleteBrandValidator,
  getSpecificBrandValidator,
  updateBrandValidator,
} from "../validators/brand.validator.js";
import authenticateJWT from "../middlewares/authenticate-jwt.js";
import isAllowed from "../middlewares/is-allowed.js";
import { upload } from "../config/multer.js";
import { normalizeBody } from "../middlewares/normalize-body.js";

const router = express.Router();

router.use(authenticateJWT);

router
  .route("/")
  .get(BrandController.wrap(BrandController.getAllBrands))
  .post(
    isAllowed("admin"),
    upload.single("image"),
    normalizeBody,
    createBrandValidator,
    BrandController.wrap(BrandController.createBrand)
  );

router
  .route("/:id")
  .put(
    updateBrandValidator,
    isAllowed("admin"),
    BrandController.wrap(BrandController.updateBrand)
  )
  .delete(
    deleteBrandValidator,
    isAllowed("admin"),
    BrandController.wrap(BrandController.deleteBrand)
  )
  .get(
    getSpecificBrandValidator,
    BrandController.wrap(BrandController.getBrandById)
  );

export default router;
