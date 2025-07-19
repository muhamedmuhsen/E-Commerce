import { check } from "express-validator";
import validateRequest from "../../middlewares/validateRequest.js";


const createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("Product title too short")
    .isLength({ max: 100 })
    .withMessage("Product title too long"),
  check("description")
    .isLength({ min: 20 })
    .withMessage("Product description too short")
    .isLength({ max: 2000 })
    .withMessage("Product description too long"),
  check("quantity")
    .isInt({ min: 0 })
    .withMessage("Product quantity must be a positive number"),
  check("sold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Product sold must be a positive number"),
  check("price")
    .isFloat({ min: 0 })
    .withMessage("Product price must be a positive number"),
  check("priceAfterDiscount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Product price after discount must be a positive number")
    .custom((value, { req }) => {
      if (value && value >= req.body.price) {
        throw new Error(
          "Price after discount must be lower than original price"
        );
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Available colors should be array of string"),
  check("imageCover").notEmpty().withMessage("Product image cover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must belong to a category")
    .isMongoId()
    .withMessage("Invalid category id"),
  check("subcategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid subcategory id"),
  check("brand")
    .notEmpty() // Should be required according to your model
    .withMessage("Product brand is required"),
  check("ratingsAverage")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1.0 and 5.0"),
  check("ratingsQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Ratings quantity must be a positive number"),
  validateRequest,
];

const updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id"),
  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Product title too short")
    .isLength({ max: 100 })
    .withMessage("Product title too long"),
  check("description")
    .optional()
    .isLength({ min: 20 })
    .withMessage("Product description too short")
    .isLength({ max: 2000 })
    .withMessage("Product description too long"),
  check("quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Product quantity must be a positive number"),
  check("sold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Product sold must be a positive number"),
  check("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Product price must be a positive number"),
  check("priceAfterDiscount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Product price after discount must be a positive number")
    .custom((value, { req }) => {
      if (value && req.body.price && value >= req.body.price) {
        throw new Error(
          "Price after discount must be lower than original price"
        );
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Available colors should be array of string"),
  check("imageCover")
    .optional()
    .notEmpty()
    .withMessage("Product image cover cannot be empty"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images should be array of string"),
  check("category").optional().isMongoId().withMessage("Invalid category id"),
  check("subcategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid subcategory id"),
  check("brand").optional().isMongoId().withMessage("Invalid brand id"),
  check("ratingsAverage")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1.0 and 5.0"),
  check("ratingsQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Ratings quantity must be a positive number"),
  validateRequest,
];

const getSpecificProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id"),
  validateRequest,
];

const deleteProductValidator = [getSpecificProductValidator];

export {
  createProductValidator,
  deleteProductValidator,
  getSpecificProductValidator,
  updateProductValidator,
};
