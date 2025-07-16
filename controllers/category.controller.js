import slugify from "slugify";
import Category from "../models/category.model.js";
import asyncWraper from "../middlewares/asyncWraper.js";

const createCategory = asyncWraper(async (req, res, next) => {
  const category = req.body;

  if (!category || !category.name) {
    next(
      res
        .status(400)
        .json({ success: false, message: '"Category name is required"' })
    );
  }

  const addedCategory = new Category({
    slug: slugify(category.name),
    ...category,
  });

  await addedCategory.save();

  res.status(201).json({ success: true, data: addedCategory });
});

const getAllCategories = asyncWraper(async (req, res, next) => {
  const categories = await Category.find();

  if (!categories) {
    next(
      res
        .status(404)
        .json({ success: false, message: `couldn't find categories` })
    );
  }

  res.status(200).json({ succes: true, data: { categories } });
});

const updateCategory = asyncWraper(async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    next(
      res
        .status(400)
        .json({ succes: false, message: "category name is required" })
    );
  }

  const updatedCategory = await Category.findOneAndUpdate(name, { name: name });

  res.status(200).json({ success: true, data: updateCategory });
});

const deleteCategory = asyncWraper(async (req, res, next) => {
  const id = req.header.id;

  if (!id) {
    next(res.status(400).json({ succes: false, message: "unvalid id" }));
  }

  await Category.findByIdAndDelete(id);

  res.status(200).json({ success: true, data: [] });
});

const getSpecificCategory = asyncWraper(async (req, res, next) => {
  const id = req.header.id;

  if (!id) {
    next(res.status(400).json({ succes: false, message: "unvalid id" }));
  }
  const category = await Category.findById(id);

  res.status(200).json({ success: true, data: category });
});

export {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getSpecificCategory,
};
