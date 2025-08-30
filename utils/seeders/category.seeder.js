import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dbConnection from "../../config/database.js";
import Category from "../../models/category.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../config.env") });

// connect to DB
dbConnection();

// Categories data
const categories = [
  { name: "Electronics", slug: "electronics" },
  { name: "Clothing", slug: "clothing" },
  { name: "Jewelry", slug: "jewelry" },
];

// Insert categories into DB
const insertCategories = async () => {
  try {
    await Category.create(categories);
    console.log("Categories Inserted Successfully");
    process.exit(0);
  } catch (error) {
    console.log("Error inserting categories:", error);
    process.exit(1);
  }
};

// Delete categories from DB
const destroyCategories = async () => {
  try {
    await Category.deleteMany();
    console.log("Categories Destroyed Successfully");
    process.exit(0);
  } catch (error) {
    console.log("Error destroying categories:", error);
    process.exit(1);
  }
};

// Handle command line arguments
if (process.argv[2] === "-i") {
  insertCategories();
} else if (process.argv[2] === "-d") {
  destroyCategories();
} else {
  console.log("Usage:");
  console.log("  node categorySeeder.js -i  (insert categories)");
  console.log("  node categorySeeder.js -d  (delete categories)");
  process.exit(0);
}
