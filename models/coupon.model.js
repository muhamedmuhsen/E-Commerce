import mongoose, { Schema } from "mongoose";

const CouponSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Coupon name is required"],
      trim: true,
      unique: true,
    },
    expire: {
      type: Date,
      required: [true, "Coupon expiration date is required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount is required"],
    },
  },
  { timestamps: true }
);


export default mongoose.model("Coupon", CouponSchema);
