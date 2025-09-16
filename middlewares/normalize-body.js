import { BadRequestError } from "../utils/api-errors.js";

export function normalizeBody(req, res, next) {
  try {
    if (req.body) {      
      if (req.file || req.files) {
        if (!req.baseUrl.includes("/api/v1/products")) {
          req.body.image = req.file.filename;
        } else {
          if (req.files) {
            if (req.files.imageCover && req.files.imageCover[0]) {
              req.body.imageCover = req.files.imageCover[0].filename;
            }
            if (req.files.image && req.files.image.length > 0) {
              req.body.image = req.files.image.map((file) => file.filename);
            }
          }
          if (
            req.body.subcategories &&
            typeof req.body.subcategories === "string"
          ) {
            req.body.subcategories = req.body.subcategories
              .split(",")
              .map((sub) => sub.trim())
              .filter((sub) => sub.length > 0);
          }
        }
      } else {
        console.log("No files uploaded");
      }
    }
    next();
  } catch (error) {
    throw new BadRequestError(error.message);
  }
}
