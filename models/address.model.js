import mongoose, { Schema } from "mongoose";
import cities from "../utils/constants/cities.js";

const AddressSchema = new Schema({
  address1: {
    type: String,
    required: [true, "First address is required"],
    trim: true,
    minlength: [3, "address too short"],
    maxlength: [50, "address too long"],
  },
  address2: {
    type: String,
    trim: true,
    minlength: [3, "address too short"],
    maxlength: [50, "address too long"],
  },
  country: {
    type: String,
    trim: true,
    required: [true, "Country is required"],
    minlength: [3, "Country too short"],
    maxlength: [32, "Country name too long"],
  },
  city: {
    type: String,
    trim: true,
    enum:[cities],
    required: [true, "City is required"],
    minlength: [3, "City too short"],
    maxlength: [32, "City name too long"],
  },
  zipCode: {
    type: Number,
    required: [true, "ZIP/Postal code is required"],
  },
});

export default mongoose.model("Address", AddressSchema);
