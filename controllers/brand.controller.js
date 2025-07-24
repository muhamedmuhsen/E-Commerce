import slugify from "slugify";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import Brand from "../models/brand.model.js";
import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

/*
    @desc   get all the brands on the app
    @route  GET /api/v1/brands/
    @access Public
*/
const getAllBrand = asyncWrapper(async (req, res, next) => {
  const totalBrands = await Brand.countDocuments();

  const apiFeatures = new ApiFeatures(req.query, Brand.find())
    .filter()
    .search()
    .sorting()
    .limitFields()
    .Paginate(totalBrands);

  // execute query
  const { mongooseQuery, pagination } = apiFeatures;
  const brands = await mongooseQuery;

  res.status(200).json({ success: true, pagination, data: { brands } });
});

/*
    @desc   create brands
    @route  GET /api/v1/brands/
    @access Private
*/
const createBrand = asyncWrapper(async (req, res, next) => {
  const brand = req.body;

  if (!brand || !brand.name) {
    return next(new ApiError("Brand name is required", 400));
  }

  const addedBrand = new Brand({
    slug: slugify(brand.name),
    ...brand,
  });

  await addedBrand.save();

  res.status(201).json({ success: true, data: addedBrand });
});

/*
    @desc   delete brand
    @route  GET /api/v1/brands/:id
    @access Private
*/
const deleteBrand = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ApiError("Invalid id", 400));
  }
  const deletedBrand = await Brand.findByIdAndDelete(id);
  if (!deletedBrand) {
    return next(new ApiError("Brand not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Brand deleted successfully",
    data: deletedBrand,
  });
});

/*
    @desc   update brand
    @route  GET /api/v1/brands/:id
    @access Private
*/
const updateBrand = asyncWrapper(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  if (!name) {
    return next(new ApiError("Brand name is required", 400));
  }

  const updatedBrand = await Brand.findByIdAndUpdate(
    id,
    {
      name: name,
      slug: slugify(name),
    },
    { new: true }
  );

  if (!updatedBrand) {
    return next(new ApiError("Brand not found", 404));
  }

  res.status(200).json({ success: true, data: updatedBrand });
});

/*
    @desc   get specific brand
    @route  GET /api/v1/brands/:id
    @access Public
*/
const getSpecificBrand = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ApiError("Invalid id", 400));
  }
  const brand = await Brand.findById(id);

  if (!brand) {
    return next(new ApiError("Brand not found", 404));
  }

  res.status(200).json({ success: true, data: brand });
});

export { createBrand, deleteBrand, getAllBrand, getSpecificBrand, updateBrand };
