import mongoose, { Schema } from "mongoose";

const SubCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: [true, "category must be unique"],
      minlength: [3, "category name too short"],
      maxlength: [32, "category name too long"],
    },
    category: mongoose.Schema.Types.ObjectId,
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const SubCategoryModel = mongoose.model("subcategories", SubCategorySchema);

export default SubCategoryModel;
