import baseService from "../services/base.service.js";

class BaseController {
    #baseService

    constructor(baseService) {
        this.#baseService = baseService;
    }

    async getAll(Model) {
        return async (req, res) => {
            let query = req.query;

            if (req.filterObject) query = req.filterObject;

            const {documents, totalDocuments, pagination} =await this.#baseService.getAll(Model, query);

            res.status(200).json({
                success: true, pagination, length: totalDocuments, data: documents,
            });
        }
    }

    async getOne(Model) {
        return async (req, res) => {
            const data = await this.#baseService.getOne(Model, req.params.id);

            res.status(200).json({success: true, data});
        }
    }

    async create(Model) {
        return async (req, res) => {
            const data = await this.#baseService.createOne(Model, req.body.document);
            res.status(201).json({success: true, data});
        }
    }

    async delete(Model) {
        return async (req, res) => {
            await this.#baseService.deleteOne(Model, req.params.id);

            res.status(200).json({
                success: true, message: `${Model.modelName} deleted successfully`,
            });
        }
    }

    async update(Model) {
        return async (req, res) => {
            const data = await this.#baseService.updateOne(Model, req.params.id, req.body);

            res.status(200).json({success: true, data});
        }
    }
}

export default new BaseController(baseService);