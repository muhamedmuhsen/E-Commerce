import slugify from "slugify";
import asyncWraper from "../middlewares/asyncWraper.js";
import Category from "../models/category.model.js";

const createCategory = asyncWraper(async (req, res, next) => {
  const category = req.body;

  if (!category || !category.name) {
    return next(
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
  res.status(200).json({ success: true, data: { categories } });
});

const updateCategory = asyncWraper(async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return next(
      res
        .status(400)
        .json({ succes: false, message: "category name is required" })
    );
  }

  const updatedCategory = await Category.findOneAndUpdate(name, {
    name: name,
    slug: slugify(name),
  });

  if (!updatedCategory) {
    return next(
      res.status(404).json({ success: false, message: "Category not found" })
    );
  }

  res.status(200).json({ success: true, data: updateCategory });
});

const deleteCategory = asyncWraper(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next(res.status(400).json({ succes: false, message: "invalid id" }));
  }
  const deletedCategory = await Category.findByIdAndDelete(id);
  if (!deletedCategory) {
    return next(
      res.status(404).json({ success: false, message: "Category not found" })
    );
  }
  res.status(200).json({ success: true, data: [] });
});

const getSpecificCategory = asyncWraper(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next(res.status(400).json({ succes: false, message: "invalid id" }));
  }
  const category = await Category.findById(id);

  if (!category) {
    return next(
      res.status(404).json({ success: false, message: "category not found" })
    );
  }

  res.status(200).json({ success: true, data: category });
});

export {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
};
