import mongoose, { Schema } from "mongoose";
import Address from "./address.model.js";
import Cart from "./cart.model.js";

const OrderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Order must belong to a user"],
  },
  shippingAddress: {
    type: Address.schema,
    required: [true, "Address is required"],
  },
  cart: {
    type: Cart.schema,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  isDeliverd: {
    type: Boolean,
    default: false,
  },
  shippingPrice: Number,
  totalOrderPrice: Number,
  paymentMethod: {
    type: String,
    enum: ["Card", "COD"],
    default: "COD",
  },
  paidAt: Date,
  DeliverdAt: Date,
});

export default mongoose.model("Order", OrderSchema);
