import { Schema, mongoose } from "mongoose";

const BrandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: [true, "Brand name must be unique"],
      minlength: [2, "Brand name must be at least 2 characters long"],
      maxlength: [32, "Brand name cannot exceed 32 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

export default mongoose.model("brands", BrandSchema);
