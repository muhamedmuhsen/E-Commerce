import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

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

BrandSchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

BrandSchema.post(
  ["findOneAndUpdate", "updateOne"],
  async function (doc, next) {
    if (doc && (this.getUpdate().name || this.getUpdate().$set)) {
      doc.slug = slugify(doc.name);
    }
    next();
  }
);

export default mongoose.model("brands", BrandSchema);
