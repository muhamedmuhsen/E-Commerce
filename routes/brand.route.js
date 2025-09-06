import express from "express";
import BrandController from "../controllers/brand.controller.js";
import {
    createBrandValidator, deleteBrandValidator, getSpecificBrandValidator, updateBrandValidator,
} from "../validators/brand.validator.js";
import authenticateJWT from "../middlewares/authenticate-jwt.js";
import isAllowed from "../middlewares/is-allowed.js";

const router = express.Router();

router.use(authenticateJWT);

router
    .route("/")
    .get(BrandController.wrap(BrandController.getAllBrands))
    .post(createBrandValidator, isAllowed("admin"), BrandController.wrap(BrandController.createBrand));

router
    .route("/:id")
    .put(updateBrandValidator, isAllowed("admin"), BrandController.wrap(BrandController.updateBrand))
    .delete(deleteBrandValidator, isAllowed("admin"), BrandController.wrap(BrandController.deleteBrand))
    .get(getSpecificBrandValidator, BrandController.wrap(BrandController.getBrandById));

export default router;
