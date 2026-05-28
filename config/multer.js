import multer from "multer";
import path from "path";
import fs from "fs";
import { BadRequestError } from "../utils/api-errors.js";

// File filter to validate image types
const imageFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError("Only image files (JPEG, JPG, PNG, WEBP) are allowed"), false);
  }
};

export const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync("./uploads")) {
        fs.mkdirSync("./uploads");
      }
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
  fileFilter: imageFilter,
  limits: {
    fileSize: 5000000, // 5MB
    files: 6, // Max 6 files
  },
});
