const nodemailer = require("nodemailer");
require("dotenv").config();

// Throws on failure so the API can report it; swallowing the error used to
// make every message look "sent" even when no mail server was configured.
// `extra` passes through nodemailer options such as `text` and `replyTo`.
const mailSender = async (email, title, body, extra = {}) => {
  const { MAIL_HOST, MAIL_USER, MAIL_PASS } = process.env;
  if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS) {
    throw new Error("Mail is not configured: set MAIL_HOST, MAIL_USER and MAIL_PASS");
  }
  const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    auth: { user: MAIL_USER, pass: MAIL_PASS },
  });
  return transporter.sendMail({
    from: `"Rahul Verma" <${MAIL_USER}>`,
    to: email,
    subject: title,
    html: body,
    ...extra,
  });
};

module.exports = mailSender;
