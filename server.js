import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import dbConnection from "./config/database.js";
import categroyRoute from "./routes/category.route.js";

dotenv.config({ path: "./config.env" });

const app = express();

// Database Connection
dbConnection();

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev")); // Logging middleware
  console.log(`Environment: ${process.env.NODE_ENV}`);
}

// Middlewares
app.use(express.json());
// routes
app.use("/api/v1/categories", categroyRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
