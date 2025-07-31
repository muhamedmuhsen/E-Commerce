import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // 1- create transporter (service eg. Gmail)
  // 2- define Email options (from to, subject, content)

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOpts = {
    from: "e-comm <noreplay.e-comm@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOpts);
};

export default sendEmail;
