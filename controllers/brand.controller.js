import BrandService from "../services/brand.service.js";
import asyncWrapper from "../middlewares/async-wrapper.js";

// TODO(handle image)
class BrandController {
    #BrandService

    constructor(BrandService) {
        this.#BrandService = BrandService;
    }

    wrap(fn) {
        return asyncWrapper(fn.bind(this));
    }

    async getAllBrands(req, res) {
        // retrieve wrong totalDocuments length
        const {documents, totalDocuments, pagination} = await this.#BrandService.getAllBrands(req.query);

        res.status(200).json({
            success: true,
            message: "Brands retrieved successfully",
            length: totalDocuments,
            pagination,
            data: documents,
        });
    }

    async getBrandById(req, res) {
        const brand = await this.#BrandService.getBrandById(req.params.id);
        res.status(200).json({
            success: true, message: "Brand retrieved successfully", data: brand,
        });
    }

    async createBrand(req, res) {
        const brand = await this.#BrandService.createBrand(req.body);

        res.status(201).json({
            success: true, message: "Brand created successfully", data: brand,
        });
    }

    async updateBrand(req, res) {
        const brand = await this.#BrandService.updateBrand(req.params.id, req.body);
        res.status(200).json({
            success: true, message: "Brand updated successfully", data: brand,
        });
    }

    async deleteBrand(req, res) {
        await this.#BrandService.deleteBrand(req.params.id);

        res.status(200).json({
            success: true, message: "Brand removed successfully",
        });
    }
}

export default new BrandController(BrandService);