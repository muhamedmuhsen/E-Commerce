import mongoose, { Schema } from "mongoose";
import Address from "./address.model.js";
import cities from "../utils/constants/cities.js";
import shippingPrices from "../utils/constants/shippingPrices.js";

const OrderItemSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
  },
});

const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    shippingAddress: {
      type: Address.schema,
      enum: [cities],
      required: [true, "Address is required"],
      //default: user.address,
    },
    items: [OrderItemSchema],
    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        message:
          "Order status must be between pending, confirmed, shipped, delivered, cancelled",
      },
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ["pending", "completed", "failed", "refunded"],
        message:
          "Payment status must be one of: pending, completed, failed, refunded",
      },
      default: "pending",
    },
    shippingPrice: {
      type: Number,
      default: 0,
      min: [0, "Shipping price cannot be negative"],
    },
    totalOrderPrice: {
      type: Number,
      min: [0, "Total order price cannot be negative"],
    },
    paymentMethod: {
      type: String,
      enum: ["Card", "COD"],
      default: "COD",
    },
    paidAt: Date,
    DeliverdAt: Date,
  },
  { timestamps: true }
);



OrderSchema.pre("save", async function (next) {
  const city = this.shippingAddress.city;

  this.shippingPrice = shippingPrices[city];

  let totalPrice = 0;
  for (const item of this.items) {
    totalPrice += item.price * item.quantity;
  }

  this.totalOrderPrice = totalPrice + this.shippingPrice;

  next();
});

export default mongoose.model("Order", OrderSchema);
