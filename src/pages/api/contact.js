import { generateEmailHTML } from "@/utils/generateEmailHtml";
import mailSender from "@/utils/mailSender";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, message } = req.body;
  console.log(req.body);

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const htmlBody = generateEmailHTML(name, email, message);
    await mailSender(
      process.env.MAIL_USER,
      `New message from ${name}`,
      htmlBody
    );

    const userConfirmationHTML = `
      <div style="background-color:#0a0a0a; padding:20px; font-family:Arial, sans-serif; color:white;">
        <div style="max-width:600px; margin:auto; border:1px solid rgba(255,255,255,0.2); border-radius:12px; background-color:rgba(255,255,255,0.05); text-align:center;">
          <h1 style="color:#B9FD50;">Thank you for contacting me!</h1>
          <p style="color:#ccc; margin:10px 0;">Hi ${name}, I’ve received your message and will get back to you soon.</p>
          <p style="background:rgba(255,255,255,0.05); padding:15px; border-radius:8px; margin:20px 0;">
            ${message}
          </p>
          <p style="font-size:12px; color:gray;">Sent by Dev Rahul Team</p>
        </div>
      </div>
    `;
    await mailSender(
      email,
      "Thanks for reaching out!",
      userConfirmationHTML
    );

    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to send message" });
  }
}
