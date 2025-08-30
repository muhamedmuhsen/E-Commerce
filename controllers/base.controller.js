import asyncWrapper from "../middlewares/async-wrapper.js";
import { NotFoundError, BadRequestError } from "../utils/api-errors.js";
import {
  createOneService,
  deleteOneService,
  getAllService,
  updateOneService,
  getOneService,
} from "../services/base.service.js";
/*
  Fix(if I used keyword for search on any other model except Product doesn't work)
*/
const getAll = (Model) => {
  return asyncWrapper(async (req, res, next) => {
    let { query } = req;
    
    if (!query) {
      return next(new NotFoundError("No query found"));
    }
    if (req.filterObject) {
      query = req.filterObject;
    }

    const { documents, totalDocuments, pagination } = await getAllService(
      Model,
      query
    );

    res.status(200).json({
      success: true,
      pagination,
      length: totalDocuments,
      data: { documents },
    });
  });
};

const deleteOne = (Model) => {
  return asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const deletedDocument = await deleteOneService(Model, id);
    if (!deletedDocument) {
      return next(new NotFoundError(`${Model.modelName} not found`));
    }

    res.status(200).json({
      success: true,
      message: `${Model.modelName} deleted successfully`,
    });
  });
};

const createOne = (Model) => {
  return asyncWrapper(async (req, res, next) => {
    const document = req.body;    
    const data = await createOneService(Model, document);
    res.status(201).json({ success: true, data });
  });
};

const updateOne = (Model) => {
  return asyncWrapper(async (req, res, next) => {
    const updatedDocument = await updateOneService(
      Model,
      req.params.id,
      req.body
    );

    if (!updatedDocument) {
      return next(new NotFoundError(`${Model.modelName} not found`));
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

    const document = await getOneService(Model, id);

    if (!document) {
      return next(new NotFoundError(`${Model.modelName} not found`));
    }

    res.status(200).json({ success: true, data: document });
  });
};
export { deleteOne, createOne, getAll, updateOne, getOne };
