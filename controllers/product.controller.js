import asyncWrapper from "../middlewares/async-wrapper.js";
import "../models/category.model.js";
import "../models/sub-category.model.js";
import ProductService from "../services/product.service.js";

class ProductController {
  #ProductService;

  constructor(ProductService, Product) {
    this.#ProductService = ProductService;
  }

  wrap(fn) {
    return asyncWrapper(fn.bind(this));
  }

  async createProduct(req, res) {
    const product = await this.#ProductService.createProduct(req.body);
    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: product,
    });
  }

  async getAllProducts(req, res) {
    const categoryPattern = /(sub)?categories/g;
    const match = req.baseUrl.match(categoryPattern);

    if (match) {
      if (match[0] === "subcategories") req.query.subcategories = req.params.id;
      else if (match[0] === "category") req.query.category = req.params.id;
    }

    const { documents, totalDocuments, pagination } =
      await this.#ProductService.getAllProducts(req.query);
    res.status(200).json({
      status: "success",
      message: "Products retrieved successfully",
      length: totalDocuments,
      pagination,
      data: documents,
    });
  }

  async updateProduct(req, res) {
    const { documents, totalDocuments, pagination } =
      await this.#ProductService.updateProduct(req.params.id, req.body);
    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      length: totalDocuments,
      pagination,
      data: documents,
    });
  }

  async deleteProduct(req, res) {
    await this.#ProductService.deleteProduct(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  }

  async getProductById(req, res) {
    const product = await this.#ProductService.getProductById(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Product retrieved successfully",
      data: product,
    });
  }
}

export default new ProductController(ProductService);
