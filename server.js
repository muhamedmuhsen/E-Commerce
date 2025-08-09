import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import dbConnection from "./config/database.js";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import limiter from "./utils/ratelimiting.js";
import hpp from "hpp";
import errorHandler from "./middlewares/errorHandler.js";
import authRoute from "./routes/auth.route.js";
import brandRoute from "./routes/brand.route.js";
import categoryRoute from "./routes/category.route.js";
import productRoute from "./routes/product.route.js";
import subcategoryRoute from "./routes/subcategory.route.js";
import userRoute from "./routes/user.route.js";
import { ApiError } from "./utils/ApiErrors.js";
import xss from "xss-clean";

dotenv.config({ path: "./config.env" });

const app = express();

// Database Connection
dbConnection();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Logging middleware
  console.log(`Environment: ${process.env.NODE_ENV}`);
}

// Middleware that make req.query writable again before calling mongoSanitize()
app.use((req, res, next) => {
  Object.defineProperty(req, "query", {
    ...Object.getOwnPropertyDescriptor(req, "query"),
    value: req.query,
    writable: true,
  });
  next();
});

// Middlewares
app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize()); //-> error here because the req.query is read-only
app.use(helmet());
app.use(cors());
//app.use(compression());
app.use(hpp());
app.use(xss());

// Morgan for better logging
app.use(morgan("dev"));

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subcategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);

// 404 handler for unmatched routes using custom ApiError
app.use((req, res, next) => {
  next(new ApiError("Route not found", 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Event to listen unhandledRejection errors
process.on("unhandledRejection", (err) => {
  console.log(err.message);
});
