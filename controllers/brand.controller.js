import asyncWrapper from "../middlewares/asyncWrapper.js";
import Brand from "../models/brand.model.js";
import ApiError from "../utils/ApiError.js";
import {
  deleteOne,
  createOne,
  getAll,
  updateOne,
  getSpecificOne,
} from "./handlersFactory.js";

/*
    @desc   get all the brands on the app
    @route  GET /api/v1/brands/
    @access Public
*/
const getAllBrand = getAll(Brand);

/*
    @desc   create brands
    @route  GET /api/v1/brands/
    @access Private
*/
const createBrand = createOne(Brand);

/*
    @desc   update brand
    @route  GET /api/v1/brands/:id
    @access Private
*/
const updateBrand = updateOne(Brand);

/*
    @desc   get specific brand
    @route  GET /api/v1/brands/:id
    @access Public
*/
const getSpecificBrand = getSpecificOne(Brand);
/*
    @desc   delete brand
    @route  GET /api/v1/brands/:id
    @access Private
*/
const deleteBrand = deleteOne(Brand);

export { createBrand, deleteBrand, getAllBrand, getSpecificBrand, updateBrand };
