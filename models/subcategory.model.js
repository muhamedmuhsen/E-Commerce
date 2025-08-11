import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

const SubCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
      trim: true,
      minlength: [2, "Subcategory name must be at least 2 characters long"],
      maxlength: [50, "Subcategory name cannot exceed 50 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
  },
  { timestamps: true }
);
SubCategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

const SubCategory = mongoose.model("SubCategory", SubCategorySchema);
export default SubCategory;
