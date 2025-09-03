import asyncWrapper from "../middlewares/async-wrapper.js";
import BaseService from "../services/base.service.js";

const getAll = (Model) => {
    return asyncWrapper(async (req, res, next) => {
        let query= req.query;

        if (req.filterObject) query = req.filterObject;

        const {documents, totalDocuments, pagination} = await BaseService.getAll(Model, query);

        res.status(200).json({
            success: true, pagination, length: totalDocuments, data: documents,
        });
    });
};

const deleteOne = (Model) => {
    return asyncWrapper(async (req, res, next) => {
        await BaseService.deleteOne(Model, req.params.id);

        res.status(200).json({
            success: true, message: `${Model.modelName} deleted successfully`,
        });
    });
};

const createOne = (Model) => {
    return asyncWrapper(async (req, res, next) => {
        const data = await BaseService.createOne(Model, req.body.document);
        res.status(201).json({success: true, data});
    });
};

const updateOne = (Model) => {
    return asyncWrapper(async (req, res, next) => {
        const updatedDocument = await BaseService.updateOne(Model, req.params.id, req.body);

        res.status(200).json({success: true, data: updatedDocument});
    });
};

const getOne = (Model) => {
    return asyncWrapper(async (req, res, next) => {
        const document = await BaseService.getOne(Model, req.params.id);

        res.status(200).json({success: true, data: document});
    });
};
export {deleteOne, createOne, getAll, updateOne, getOne};
