import express from "express";
import SubCategoryController, {setCategoryIdToBody, setFilterObject} from "../controllers/sub-category.controller.js";
import {
    createSubCategoryValidator, deleteSubCategoryValidator, getSpecificSubCategoryValidator, updateSubCategoryValidator,
} from "../validators/sub-category.validator.js";
import authenticateJWT from "../middlewares/authenticate-jwt.js";
import isAllowed from "../middlewares/is-allowed.js";

// mergeParams allow us to access parameters on other routes
const router = express.Router({mergeParams: true});


router.use(authenticateJWT);

router.get("/", setFilterObject, SubCategoryController.wrap(SubCategoryController.getAllSubCategories));

router.post("/", isAllowed("admin"), setCategoryIdToBody, createSubCategoryValidator, SubCategoryController.wrap(SubCategoryController.createSubCategory));

router
    .route("/:id")
    .put(updateSubCategoryValidator, isAllowed("admin"), SubCategoryController.wrap(SubCategoryController.updateSubCategory))
    .delete(deleteSubCategoryValidator, isAllowed("admin"), SubCategoryController.wrap(SubCategoryController.deleteSubCategory))
    .get(getSpecificSubCategoryValidator, SubCategoryController.wrap(SubCategoryController.getSubCategory));

export default router;
