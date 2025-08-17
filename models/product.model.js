import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Product name must be at least 2 characters long"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    price: { type: Number, required: [true, "Product price is required"] },
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
    subcategories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "SubCategory",
      index: true,
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    brand: { type: String },
    imageCover: {
      type: String,
      required: [true, "Product Image cover is required"],
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    colors: [String],
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    sold: { type: Number, default: 0 },
    image: {
      type: [String],
      // validate: {
      //   validator: function (v) {
      //     return !v || validator.isURL(v);
      //   },
      //   message: "Please provide a valid image URL",
      // },
    },
  },
  { timestamps: true }
);

ProductSchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

// TODO(populate subcategories if found)
ProductSchema.pre(/^find/, function (next) {
  this.populate([
    { path: "category", select: "name -_id" },
    { path: "subcategories", select: "name -_id" },
  ]);
  next();
});

const ProductModel = mongoose.model("Product", ProductSchema);

export default ProductModel;
