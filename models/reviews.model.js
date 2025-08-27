import mongoose, { Schema } from "mongoose";

const ReviewsSchema = new Schema(
  {
    review: {
      type: Number,
      required: [true, "Review is required"],
      enum: [1, 2, 3, 4, 5],
    },
    message: {
      type: String,
      maxLength: [500, "Message cannot exceed 500 characters"],
      trim: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
  },
  { timestamps: true }
);

ReviewsSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" })
      .populate({ path: "product", select: "name" });
  next();
});


export default mongoose.model("Review", ReviewsSchema);
