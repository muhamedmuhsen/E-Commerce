import asyncWrapper from "../middlewares/asyncWrapper.js";
import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import bcrypt from "bcryptjs";
/*
  Fix(if i used keyword for search on any other model excpet Product doesn't work)
*/
const getAll = (Model) => {
  return asyncWrapper(async (req, res, next) => {
    const totalDocuments = await Model.countDocuments();

    const apiFeatures = new ApiFeatures(req.query, Model.find())
      .filter()
      .sorting()
      .search("Product")
      .limitFields()
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

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError("Document not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
      data: document,
    });
  });
};

const createOne = (Model) => {
  return asyncWrapper(async (req, res, next) => {
    const document = req.body;

    // if (!document || !document.name) {
    //   return next(new ApiError("Document name is required", 400));
    // }

    if (Model === "SubCategory") {
      const ParentCategory = await Category.findById(category);

      if (!ParentCategory) {
        return next(new ApiError("Paretnt category not found", 404));
      }
    }

    if (Model === "User") {
      // hash password
      const password = document.password;
      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(password, salt);
      document.password = hashpassword;
    }

    const addedDocument = new Model({
      ...document,
    });

    await addedDocument.save();

    res.status(201).json({ success: true, data: addedDocument });
  });
};

const updateOne = (Model) => {
  return asyncWrapper(async (req, res, next) => {
    const updatedDocument = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (Model === "Product") {
      updatedDocument
        .populate({ path: "category", select: "name -_id" })
        .populate({ path: "subcategories", select: "name -_id" });
    }

    if (Model === "SubCategory") {
      if (!category) {
        return next(new ApiError("Parent Category name is required", 400));
      }
      const ParentCategory = await Category.findById(category);

      if (!ParentCategory) {
        return next(new ApiError("Paretnt category not found", 404));
      }
    }

    if (!updatedDocument) {
      return next(new ApiError("Document not found", 404));
    }

    res.status(200).json({ success: true, data: updatedDocument });
  });
};

const getOne = (Model) => {
  return asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
      return next(new ApiError("Invalid id", 400));
    }
    const document = await Model.findById(id);

    if (!document) {
      return next(new ApiError("document not found", 404));
    }

    if (Model == "Product") {
      document.populate("category", "name").populate("subcategories", "name");
    }

    res.status(200).json({ success: true, data: document });
  });
};
export { deleteOne, createOne, getAll, updateOne, getOne };
