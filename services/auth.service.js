import User from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";
import createToken from "../utils/createToken.js";
import hashingPassword from "../utils/hashingPassword.js";
import { ApiError } from "../utils/ApiErrors.js";

const registerService = async (name, email, password) => {
  const user = new User({
    name,
    email,
    password,
  });

  await user.save();
  const token = createToken(user._id);
  return { user: user, token };
};

const loginService = async (id) => createToken(id);

const resetPasswordService = async (user, newPassword) => {
  user.password = newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetCodeExpire = undefined;
  user.passwordResetCodeVerified = undefined;
  await user.save();

  const token = createToken(user._id);
  return token;
};

const verifyResetCodeService = async (user) => {
  user.passwordResetCodeVerified = true;
  await user.save();
};

const forgetPasswordService = async (user) => {
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = hashingPassword(resetCode);

  user.passwordResetCode = hashedResetCode;
  user.passwordResetCodeExpire = Date.now() + 60 * 60 * 1000;
  user.passwordResetCodeVerified = false;

  await user.save();

  try {
    // Send mail to the user with reset code
    const message = `Hi ${user.name},\n\nWe received a request to reset the password on your E-shop Account.\n\nYour reset code is: ${resetCode}\n\nEnter this code to complete the reset. This code is valid for 1 hour.\n\nThanks for helping us keep your account secure.\nThe E-shop Team`;

    await sendEmail({
      email: "mohsenisdone@gmail.com",
      subject: "Password Reset Code - Valid for 1 hour",
      message,
    });

    console.log(`Password reset email sent to ${user.email}`);
  } catch (err) {
    // Log the actual error for debugging
    console.error("Email sending failed:", err.message);
    
    // Clean up user reset fields
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpire = undefined;
    user.passwordResetCodeVerified = undefined;
    await user.save();

    // Throw a more informative error
    throw new ApiError(`Failed to send reset email: ${err.message}`, 500);
  }
};

export {
  loginService,
  registerService,
  resetPasswordService,
  verifyResetCodeService,
  forgetPasswordService,
};
