const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  if (!process.env.EMAIL_HOST ||!process.env.EMAIL_PORT ||!process.env.EMAIL_USER ||!process.env.EMAIL_PASS) {
    throw new Error("Missing email credentials");
  }
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
