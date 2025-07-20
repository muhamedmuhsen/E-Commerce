import slugify from "slugify";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import Brand from "../models/brand.model.js";
import ApiError from "../utils/ApiError.js";

/*
    @desc   get all the brands on the app
    @route  GET /api/v1/brands/
    @access Public
*/
const getAllBrand = asyncWrapper(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const offset = (page - 1) * limit;

  const brands = await Brand.find().skip(offset).limit(limit);
  res.status(200).json({ success: true, page: page, data: { brands } });
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

  const addedCategory = new Brand({
    slug: slugify(brand.name),
    ...brand,
  });

  await addedCategory.save();

  res.status(201).json({ success: true, data: addedCategory });
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
