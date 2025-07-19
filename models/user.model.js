import mongoose, { Schema } from "mongoose";
import validator from "validator";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "username is required"],
      minlength: [3, "username too short"],
      maxlength: [32, "username too long"],
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
      minlength:[8,'Password must be at least 8 characters long']
    },
    role:{
      type:String,
      enum:['user','admin'],
      default:'user'
    }
  },
  { timestamps: true }
);

const UserModel = mongoose.model("user", UserSchema);

export default UserModel;
