import ApiFeatures from "../utils/api-features.js";
import Category from "../models/category.model.js";
import {NotFoundError, BadRequestError} from "../utils/api-errors.js";
import {Model} from "mongoose";


class BaseService {
    async deleteOne(Model, id) {
        const document = await Model.findByIdAndDelete(id).lean();
        if (!document) throw new NotFoundError(`${Model.modelName} not found`);
        return document;
    }

    async createOne(Model, document) {
        const doc = await Model.create({...document}).lean();

        deletePasswordProperty(Model,doc)

        return doc;
    }

    async updateOne(Model, id, body) {
        return await Model.findByIdAndUpdate(id, body, {
            new: true,
        }).lean();
    }

    async getAll(Model, query) {
        const apiFeatures = new ApiFeatures(query, Model.find())
            .filter()
            .search(Model.modelName);

        const documents = await apiFeatures.mongooseQuery.lean();
        const totalDocuments = documents.length;

        apiFeatures.sorting().paginate(totalDocuments).limitFields();

        deletePasswordProperty(Model, documents)

        const {pagination} = apiFeatures;
        return {documents, totalDocuments, pagination};
    }

    async getOne(Mode, id) {
        const document = await Model.findById(id).lean();
        if (!document) throw new NotFoundError(`${Model.modelName} not found`);
        return document;
    }
}


function deletePasswordProperty(Model, documents) {
    if (Object.keys(Model.schema.paths).includes("password")) {
        for (const index in documents)
            delete documents[index].password
    }
}

export default new BaseService();