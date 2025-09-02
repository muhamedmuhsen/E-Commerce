import mongoose, { Schema } from "mongoose";

const WishlistSchema = new Schema(
  {
    product: {
      type: [mongoose.Schema.Types.ObjectId],
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

WishlistSchema.pre(/^find/, function (next) {
  this.populate({
    path: "product",
    select: "name price description imageCover",
  });
  this.populate({ path: "user", select: "name" });
  this.lean()
  next();
});

export default mongoose.model("Wishlist", WishlistSchema);
