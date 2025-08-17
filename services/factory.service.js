import ApiFeatures from "../utils/apiFeatures.js";
import Category from "../models/category.model.js";
import { NotFoundError, BadRequestError } from "../utils/ApiErrors.js";

const deleteOneService = async (Model, id) => {
  const document = await Model.findByIdAndDelete(id);
  return document;
};

const createOneService = async (Model, document) => {
  // Handle SubCategory validation
  if (Model.modelName === "SubCategory") {
    const parentCategory = await Category.findById(document.category);
    if (!parentCategory) {
      throw new NotFoundError("Parent category not found");
    }
  }

  const addedDocument = new Model({
    ...document,
  });

  await addedDocument.save();

  const doc = addedDocument.toObject();

  delete doc.password;

  return doc;
};

const updateOneService = async (Model, id, body) => {
  // Handle User password validation
  if (Model.modelName === "User" && body.password) {
    throw new BadRequestError(
      "Use /change-password endpoint to update password"
    );
  }

  // Handle SubCategory validation
  if (Model.modelName === "SubCategory") {
    if (!body.category) {
      throw new BadRequestError("Parent Category name is required");
    }
    const parentCategory = await Category.findById(body.category);
    if (!parentCategory) {
      throw new NotFoundError("Parent category not found");
    }
  }

  const document = await Model.findByIdAndUpdate(id, body, {
    new: true,
  });
  return document;
};

const getAllService = async (Model, query) => {
  const apiFeatures = new ApiFeatures(query, Model.find())
    .filter()
    .search(Model.modelName)
    .limitFields()
    .sorting();

  let { mongooseQuery, _ } = apiFeatures;

  const documents = await mongooseQuery;
  const totalDocuments = documents.length;
  apiFeatures.Paginate(totalDocuments);
  let { pagination } = apiFeatures;
  return { documents, totalDocuments, pagination };
};

const getOneService = async (Model, id) => {
  const document = await Model.findById(id);

  if (!document) {
    return null;
  }

  // Handle population for Product model
  if (Model.modelName === "Product") {
    await document
      .populate("category", "name")
      .populate("subcategories", "name");
  }

  return document;
};
export {
  deleteOneService,
  createOneService,
  updateOneService,
  getAllService,
  getOneService,
};
