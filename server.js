const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev")); // Logging middleware
  console.log(`Environment: ${process.env.NODE_ENV}`);
} 

async function connectDB(params) {
  const DATABASE_URL = process.env.DATABASE_URL;
  await mongoose
    .connect(DATABASE_URL)
    .then((result) => console.log("connected to the database"))
    .catch((err) => console.log("error while connecting to the database"));
}

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
