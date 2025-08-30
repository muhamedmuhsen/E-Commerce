import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dbConnection from "../../config/database.js";
import Category from "../../models/category.model.js";
import Product from "../../models/product.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../config.env") });

// connect to DB
dbConnection();

// Read data
const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "products.json"))
);

// Insert data into DB
const insertData = async () => {
  try {
    // Get existing categories from DB
    const categories = await Category.find();

    if (categories.length === 0) {
      console.log("No categories found! Please run categorySeeder.js first:");
      console.log("node categorySeeder.js -i");
      process.exit(1);
    }

    // Map category slugs to ObjectIds
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    // Update products with correct category ObjectIds
    const updatedProducts = products.map((product) => ({
      ...product,
      category: categoryMap[product.category],
    }));

    await Product.create(updatedProducts);
    console.log("Products Inserted Successfully");
    process.exit(0);
  } catch (error) {
    console.log("Error inserting products:", error);
    process.exit(1);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("Products Destroyed Successfully");
    process.exit(0);
  } catch (error) {
    console.log("Error destroying products:", error);
    process.exit(1);
  }
};

// Handle command line arguments
if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  destroyData();
} else {
  console.log("Usage:");
  console.log("  node seeder.js -i  (insert products)");
  console.log("  node seeder.js -d  (delete products)");
  process.exit(0);
}
