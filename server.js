import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import dbConnection from "./config/database.js";

// Import all models FIRST to register them with Mongoose
import "./models/brand.model.js";
import "./models/category.model.js";
import "./models/product.model.js";
import "./models/subcategory.model.js";

// Then import other modules
import errorHandler from "./middlewares/errorHandler.js";
import authRoute from "./routes/auth.route.js";
import brandRoute from "./routes/brand.route.js";
import categoryRoute from "./routes/category.route.js";
import productRoute from "./routes/product.route.js";
import subcategoryRoute from "./routes/subcategory.route.js";
import userRoute from './routes/user.route.js'
import ApiError from "./utils/ApiError.js";

dotenv.config({ path: "./config.env" });

const app = express();

// Database Connection
dbConnection();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Logging middleware
  console.log(`Environment: ${process.env.NODE_ENV}`);
}

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add Morgan for better logging
app.use(morgan('dev'));

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subcategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users",userRoute)

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
