import mongoose, { Schema } from "mongoose";

const CartSchema = new Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: {
          type: String,
        },
        price: {
          type: Number,
        },
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// TODO(calcuate totalPriceAfterDiscount)
CartSchema.pre("save", function (next) {
  let totalPrice = 0;
  if (this.cartItems && Array.isArray(this.cartItems)) {
    this.cartItems.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });
  }
  this.totalCartPrice = totalPrice;
  next();
});

export default mongoose.model("Cart", CartSchema);
