import mongoose, { Schema } from "mongoose";
import validator from "validator";

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Product name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Product name must be at least 2 characters long"],
      maxlength: [50, "Product name cannot exceed 50 characters"],
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: { type: Number, required: true },
    priceAfterDiscount: { type: Number },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: [true, "SubCategory is required"],
      index: true,
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    image: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || validator.isURL(v);
        },
        message: "Please provide a valid image URL",
      },
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", ProductSchema);

export default ProductModel;
