import mongoose, { Schema } from "mongoose";

const CartSchema = new Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
        quantity: {
          type: Number,
          default: 1,
          min: [1, "Quantity must be at least 1"],
          validate: {
            validator: Number.isInteger,
            message: "Quantity must be an integer",
          },
        },
        color: {
          type: String,
          required: [true, "Color is required"],
          trim: true,
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
          min: [0, "Price must be positive"],
        },
      },
    ],
    totalCartPrice: {
      type: Number,
      default: 0,
      min: [0, "Total price must be positive"],
    },
    totalPriceAfterDiscount: {
      type: Number,
      min: [0, "Discounted price must be positive"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true, // One cart per user
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
  this.totalCartPrice = parseFloat(totalPrice);
  next();
});

export default mongoose.model("Cart", CartSchema);
