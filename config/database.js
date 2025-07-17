import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Connected successfully to the database");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

export default dbConnection;
