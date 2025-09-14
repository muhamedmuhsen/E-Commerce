import BrandService from "../services/brand.service.js";
import asyncWrapper from "../middlewares/async-wrapper.js";

// TODO(handle image)
class BrandController {
  #BrandService;

  constructor(BrandService) {
    this.#BrandService = BrandService;
  }

  wrap(fn) {
    return asyncWrapper(fn.bind(this));
  }

  async getAllBrands(req, res) {
    // retrieve wrong totalDocuments length
    const { documents, totalDocuments, pagination } =
      await this.#BrandService.getAllBrands(req.query);

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
      success: true,
      message: "Brand retrieved successfully",
      data: brand,
    });
  }

  async createBrand(req, res) {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    const brand = await this.#BrandService.createBrand(req.body);
    brand.image = req.file.filename;
    await brand.save();
    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: brand,
    });
  }

  async updateBrand(req, res) {
    console.log(req.body);

    const brand = await this.#BrandService.updateBrand(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      data: brand,
    });
  }

  async deleteBrand(req, res) {
    await this.#BrandService.deleteBrand(req.params.id);

    res.status(200).json({
      success: true,
      message: "Brand removed successfully",
    });
  }
}

export default new BrandController(BrandService);
