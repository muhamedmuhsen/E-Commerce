import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    console.log("Connecting to database with URI:", process.env.DATABASE_URI);
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Connected successfully to the database");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

export default connectToDatabase;
