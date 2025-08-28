import mongoose, { Schema } from "mongoose";
import Address from "./address.model.js";
import Cart from "./cart.model.js";
import cities from "../utils/cities.js";

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
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
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

const ShippingPrices = {
  [cities.CAIRO]: 60,
  [cities.GIZA]: 60,
  [cities.ALEXANDRIA]: 80,
  [cities.MANSOURA]: 80,
  [cities.TANTA]: 80,
  [cities.ISMAILIA]: 80,
  [cities.PORT_SAID]: 80,
  [cities.SUEZ]: 80,
  [cities.BENI_SUEF]: 100,
  [cities.FAYOUM]: 100,
  [cities.MINYA]: 100,
  [cities.ASYUT]: 100,
  [cities.LUXOR]: 100,
  [cities.ASWAN]: 100,
  [cities.HURGHADA]: 120,
  [cities.SHARM_EL_SHEIKH]: 120,
  [cities.MARSA_MATRUH]: 120,
  [cities.EL_ARISH]: 120,
};

OrderSchema.pre("save", async function (next) {
  const city = this.shippingAddress.city;

  this.shippingPrice = ShippingPrices[city];

  const cart = await Cart.findById(this.cart);

  this.totalOrderPrice = cart.totalCartPrice + this.shippingPrice;

  next();
});

export default mongoose.model("Order", OrderSchema);
