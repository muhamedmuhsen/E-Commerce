import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "username is required"],
      minlength: [3, "username too short"],
      maxlength: [32, "username too long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    isActive: { type: Boolean, default: true },
    passwordChangeAt: Date,
    passwordResetCode: String,
    passwordResetCodeExpire: Date,
    passwordResetCodeVerified: Boolean,
    phone: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profileImg: { type: String },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;
