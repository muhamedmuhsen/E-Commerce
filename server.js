import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import dbConnection from "./config/database.js";
import errorHandler from "./middlewares/errorHandler.js";
import categoryRoute from "./routes/category.route.js";
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

// routes
app.use("/api/v1/categories", categoryRoute);

// 404 handler for unmatched routes using custom ApiError
app.use((req, res, next) => {
  next(new ApiError("Route not found", 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
