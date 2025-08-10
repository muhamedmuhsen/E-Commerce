import asyncWrapper from "../middlewares/asyncWrapper.js";
import {
  ApiError,
  NotFoundError,
  BadRequestError,
} from "../utils/ApiErrors.js";
import ApiFeatures from "../utils/apiFeatures.js";
import bcrypt from "bcryptjs";
import Category from "../models/category.model.js";
import {
  createOneService,
  deleteOneService,
  updateOneService,
} from "../services/factory.service.js";
/*
  Fix(if i used keyword for search on any other model excpet Product doesn't work)
*/
const getAll = (Model) => {
  return asyncWrapper(async (req, res, next) => {
    const totalDocuments = await Model.countDocuments();

    const apiFeatures = new ApiFeatures(req.query, Model.find())
      .filter()
      .search(Model.modelName)
      .limitFields()
      .sorting()
      .Paginate(totalDocuments);

    // execute query
    const { mongooseQuery, pagination } = apiFeatures;

    const documents = await mongooseQuery;

    res.status(200).json({
      success: true,
      pagination,
      length: documents.length,
      data: { documents },
    });
  });
};

const deleteOne = (Model) => {
  return asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findById(id);
    if (!document) {
      return next(new NotFoundError(`${Model.modelName} not found`));
    }
    await deleteOneService(Model, id);
    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  });
};

const createOne = (Model) => {
  return asyncWrapper(async (req, res, next) => {
    let document = req.body;

    // if (!document || !document.name) {
    //   return next(new ApiError("Document name is required", 400));
    // }

    if (Model.modelName === "SubCategory") {
      const ParentCategory = await Category.findById(req.body.category);

      if (!ParentCategory) {
        return next(new NotFoundError("Paretnt category not found"));
      }
    }

    const data = await createOneService(Model, document);

    res.status(201).json({ success: true, data });
  });
};

// TODO(review because i update first and then validate while this is wrong)
const updateOne = (Model) => {
  return asyncWrapper(async (req, res, next) => {
    if (Model.modelName === "User" && req.body.password) {
      return next(
        new BadRequestError("Use /change-password endpoint to update password")
      );
    }

    if (Model.modelName === "SubCategory") {
      if (!req.body.category) {
        return next(new BadRequestError("Parent Category name is required"));
      }
      const ParentCategory = await Category.findById(req.body.category);

      if (!ParentCategory) {
        return next(new NotFoundError("Paretnt category not found"));
      }
    }

    const updatedDocument = await updateOneService(
      Model,
      req.params.id,
      req.body
    );

    if (!updatedDocument) {
      return next(new NotFoundError("Document not found"));
    }

    res.status(200).json({ success: true, data: updatedDocument });
  });
};

const getOne = (Model) => {
  return asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
      return next(new BadRequestError("Invalid id"));
    }
    const document = await Model.findById(id);

    if (!document) {
      return next(new NotFoundError("document not found"));
    }

    if (Model.modelName == "Product") {
      await document
        .populate("category", "name")
        .populate("subcategories", "name");
    }

    res.status(200).json({ success: true, data: document });
  });
};
export { deleteOne, createOne, getAll, updateOne, getOne };
