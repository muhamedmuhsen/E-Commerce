import User from "../models/user.model.js";
import sendEmail from "../utils/send-email.js";
import createToken from "../utils/create-token.js";
import hashing from "../utils/hasing.js";
import {ApiError, BadRequestError, NotFoundError} from "../utils/api-errors.js";

class AuthService {
  async login(email, password) {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password, user.password))) {
      throw new UnauthorizedError("Invalid credentials");
    }

    return createToken(user._id);
  }

  async register(name, email, password) {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      throw new BadRequestError("Please try another mail");
    }

    const user = new User({
      name,
      email,
      password,
    });

    await user.save();
    return createToken(user._id);
  }

  async resetPassword(email, newPassword) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError("user not found");
    }

    if (!user.passwordResetCodeVerified) {
      throw new BadRequestError("reset code not verified");
    }

    user.password = newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpire = undefined;
    user.passwordResetCodeVerified = undefined;
    await user.save();

    return createToken(user._id);
  }

  async verifyResetCode(resetCode) {
    const hashedResetCode = hashing(resetCode);

    const user = await User.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetCodeExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new BadRequestError("Invalid reset code");
    }

    user.passwordResetCodeVerified = true;
    await user.save();
  }

  async forgetPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError("Email not found");
    }

    const resetCode = generateResetCode();
    user.passwordResetCode = hashing(resetCode);
    user.passwordResetCodeExpire = expireAfterOneHour();
    user.passwordResetCodeVerified = false;

    await user.save();

    try {
      const message = `Hi ${user.name},\n\nWe received a request to reset the password on your E-shop Account.\n\nYour reset code is: ${resetCode}\n\nEnter this code to complete the reset. This code is valid for 1 hour.\n\nThanks for helping us keep your account secure.\nThe E-shop Team`;

      await sendEmail({
        email: user.email,
        subject: "Password Reset Code - Valid for 1 hour",
        message,
      });
    } catch (err) {
      console.error("Email sending failed:", err.message);

      user.passwordResetCode = undefined;
      user.passwordResetCodeExpire = undefined;
      user.passwordResetCodeVerified = undefined;
      await user.save();

      throw new ApiError(`Failed to send reset email: ${err.message}`, 500);
    }
  }
}

function expireAfterOneHour() {
  return Date.now() + 60 * 60 * 1000;
}

function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default new AuthService();
