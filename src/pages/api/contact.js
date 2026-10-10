import { generateEmailHTML, generateConfirmationHTML, textForRahul, textForSender } from "@/utils/generateEmailHtml";
import mailSender from "@/utils/mailSender";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const email = String(req.body?.email ?? "").trim();
  // Raw values for plain-text parts and headers; escaped ones for HTML.
  const rawName = String(req.body?.name ?? "").trim().slice(0, 120);
  const rawMessage = String(req.body?.message ?? "").trim().slice(0, 5000);
  const name = esc(rawName);
  const message = esc(rawMessage);

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!/^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(email)) {
    return res.status(400).json({ message: "Enter a valid email" });
  }

  try {
    // To Rahul: replying goes straight to the sender.
    await mailSender(process.env.MAIL_USER, `New letter from ${rawName.replace(/[\r\n]/g, " ")}`, generateEmailHTML(name, esc(email), message), {
      text: textForRahul(rawName, email, rawMessage),
      replyTo: email,
    });
    // Receipt to the sender.
    await mailSender(email, "Letter received: thanks for writing", generateConfirmationHTML(name, message), {
      text: textForSender(rawName, rawMessage),
    });

    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to send message" });
  }
}
