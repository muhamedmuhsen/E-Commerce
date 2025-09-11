import ApiFeatures from "../utils/api-features.js";
import Category from "../models/category.model.js";
import {NotFoundError, BadRequestError} from "../utils/api-errors.js";
import {Model} from "mongoose";

class BaseService {

    async getAll(Model, query) {
        const apiFeatures = new ApiFeatures(query, Model.find())
            .filter()
            .search(Model.modelName)

        const [totalDocuments, documents] = await Promise.all([
            apiFeatures.totalDocuments = await apiFeatures.mongooseQuery.clone().countDocuments(),
            apiFeatures.sorting().limitFields().paginate().mongooseQuery.lean()
        ])

        const {pagination} = apiFeatures;

        deletePasswordProperty(Model, documents);

        return documents ? {documents, totalDocuments, pagination} : {documents: [], totalDocuments: 0, pagination};
    }


    async deleteOne(Model, id) {
        const document = await Model.findByIdAndDelete(id);
        if (!document) throw new NotFoundError(`${Model.modelName} not found`);
        return true;
    }

    async createOne(Model, data) {

        const doc = await Model.create({...data});

        deletePasswordProperty(Model, doc);

        return doc;
    }

    async updateOne(Model, id, body) {
        const doc = await Model.findByIdAndUpdate(id, body, {
            new: true, runValidators: true,
        }).lean();

        if (!doc) throw new NotFoundError(`${Model.modelName} not found`);

        return doc;
    }


    async getOne(Model, id) {
        const document = await Model.findById(id).lean();
        if (!document) throw new NotFoundError(`${Model.modelName} not found`);
        return document;
    }
}

function deletePasswordProperty(Model, documents) {
    if (Object.keys(Model.schema.paths).includes("password")) {
        for (const index in documents) delete documents[index].password;
    }
}

export default new BaseService();
