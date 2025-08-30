import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false, // true for 465, false for other ports like 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOpts = {
      from: process.env.EMAIL_FROM,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    const result = await transporter.sendMail(mailOpts);
    return result;
  } catch (error) {
    console.error("Email sending error:", {
      message: error.message,
      code: error.code,
      command: error.command,
    });
    throw error; // Re-throw the original error with full details
  }
};

export default sendEmail;
