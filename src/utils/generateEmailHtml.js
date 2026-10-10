// Contact-form emails in the portfolio's "drafting sheet" style.
//
// Email clients ignore <style> blocks, web fonts and box-shadow, so this is
// table layout with inline styles only. The hard offset shadow is faked with
// thick right/bottom borders, and fonts fall back to system faces.
// Every value passed in must already be HTML-escaped by the caller.

const SITE = "https://rahulverma.site";
const C = {
  page: "#f1efe9",
  sheet: "#fbfaf6",
  ink: "#12151c",
  ink2: "#2a2f3a",
  muted: "#616977",
  line: "#d9dde3",
  accent: "#e5470d",
  teal: "#0e7c7b",
  yellow: "#f4dc4b",
};
const DISPLAY = "'Arial Narrow','Helvetica Neue Condensed',Arial,sans-serif";
const BODY = "Arial,Helvetica,sans-serif";
const MONO = "'Courier New',Courier,monospace";

const nl2br = (s) => String(s).replace(/\r?\n/g, "<br>");
const stamp = (d = new Date()) =>
  d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " IST";

// Small uppercase mono label.
const label = (text, color = C.muted) =>
  `<span style="font-family:${MONO};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${color};">${text}</span>`;

// The letter itself: a ruled notepad page with a red margin.
const notepad = (body, sign) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
    <tr><td style="background:${C.ink};height:14px;font-size:0;line-height:0;">&nbsp;</td></tr>
    <tr>
      <td style="background:${C.sheet};border:1px solid ${C.line};border-top:0;border-left:3px solid ${C.accent};padding:20px 22px;font-family:${MONO};font-size:15px;line-height:26px;color:${C.teal};">
        ${body}
        ${sign ? `<p style="margin:22px 0 0;font-family:${BODY};font-size:14px;color:${C.ink};">${sign}</p>` : ""}
      </td>
    </tr>
  </table>`;

function shell({ preheader, sheetNo, title, titleAccent, content, footer }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:32px 14px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;border-collapse:collapse;">

          <!-- Header: monogram + sheet number -->
          <tr>
            <td style="padding:0 0 16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="width:40px;">
                    <div style="width:36px;height:36px;line-height:36px;text-align:center;background:${C.ink};color:${C.page};font-family:${DISPLAY};font-weight:900;font-size:17px;">RV</div>
                  </td>
                  <td style="padding-left:10px;font-family:${MONO};font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${C.ink};line-height:16px;">
                    Rahul Verma<br><span style="color:${C.muted};font-size:10px;">Full-stack eng.</span>
                  </td>
                  <td align="right">${label(sheetNo)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sheet: ink border, faked hard shadow -->
          <tr>
            <td style="background:${C.sheet};border:2px solid ${C.ink};border-right:7px solid ${C.ink};border-bottom:7px solid ${C.ink};padding:28px 26px 30px;">
              <h1 style="margin:0;font-family:${DISPLAY};font-weight:900;font-size:40px;line-height:40px;letter-spacing:-0.5px;text-transform:uppercase;color:${C.ink};">
                ${title}<span style="color:${C.accent};">${titleAccent}</span>
              </h1>
              <div style="height:2px;background:${C.ink};margin:18px 0 22px;font-size:0;line-height:0;">&nbsp;</div>
              ${content}
            </td>
          </tr>

          <!-- Footer / title block -->
          <tr>
            <td style="padding:18px 2px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="font-family:${MONO};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${C.muted};line-height:18px;">${footer}</td>
                  <td align="right" style="font-family:${MONO};font-size:11px;letter-spacing:1px;text-transform:uppercase;">
                    <a href="${SITE}" style="color:${C.accent};text-decoration:none;">rahulverma.site ↗</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** The email Rahul receives when someone submits the contact form. */
export const generateEmailHTML = (name, email, message) => {
  const when = stamp();
  const row = (k, v) => `
    <tr>
      <td style="width:92px;padding:10px 12px;border:1px solid ${C.ink};background:${C.page};vertical-align:top;">${label(k)}</td>
      <td style="padding:10px 12px;border:1px solid ${C.ink};font-family:${BODY};font-size:15px;color:${C.ink};word-break:break-word;">${v}</td>
    </tr>`;
  return shell({
    preheader: `${name} posted a letter: ${message.slice(0, 90)}`,
    sheetNo: "Inbox · new letter",
    title: "New letter",
    titleAccent: ".",
    content: `
      <p style="margin:0 0 18px;font-family:${BODY};font-size:15px;line-height:23px;color:${C.ink2};">
        Someone just tore a page off your notepad and posted it.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 24px;">
        ${row("From", name)}
        ${row("Reply to", `<a href="mailto:${email}" style="color:${C.teal};">${email}</a>`)}
        ${row("Posted", when)}
      </table>
      ${label("The letter", C.accent)}
      <div style="height:8px;font-size:0;line-height:0;">&nbsp;</div>
      ${notepad(`<span style="color:${C.ink};font-family:${BODY};">Dear Rahul,</span><br><br>${nl2br(message)}`, `Talk soon, ${name}`)}
      <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:26px;">
        <tr>
          <td style="background:${C.accent};border:2px solid ${C.ink};border-right:5px solid ${C.ink};border-bottom:5px solid ${C.ink};">
            <a href="mailto:${email}?subject=${encodeURIComponent("Re: your letter")}" style="display:inline-block;padding:12px 20px;font-family:${MONO};font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:#ffffff;text-decoration:none;">Reply to ${name} ✉</a>
          </td>
        </tr>
      </table>`,
    footer: `Contact form · ${when}`,
  });
};

/** The confirmation the sender receives. */
export const generateConfirmationHTML = (name, message) => {
  const steps = [
    ["Read", "I read every letter myself, usually the same day."],
    ["Reply", "You'll hear back within a day, with questions or a first take."],
    ["Ship", "If it's a fit, we scope it and start building."],
  ];
  return shell({
    preheader: `Hi ${name}, your letter landed. I'll reply within a day.`,
    sheetNo: "Receipt · letter posted",
    title: "Letter received",
    titleAccent: ".",
    content: `
      <p style="margin:0 0 6px;font-family:${BODY};font-size:16px;line-height:24px;color:${C.ink};">Hi ${name},</p>
      <p style="margin:0 0 24px;font-family:${BODY};font-size:15px;line-height:23px;color:${C.ink2};">
        Your paper plane made it into the postbox. Thanks for writing. Here's a copy of what you sent, for your records.
      </p>
      ${notepad(nl2br(message))}
      <div style="height:26px;font-size:0;line-height:0;">&nbsp;</div>
      ${label("What happens next", C.accent)}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:10px;">
        ${steps
          .map(
            ([k, v], i) => `
        <tr>
          <td style="width:38px;padding:12px 0;border-top:1px solid ${C.line};vertical-align:top;font-family:${MONO};font-size:13px;color:${C.accent};">0${i + 1}.</td>
          <td style="padding:12px 0;border-top:1px solid ${C.line};">
            <span style="font-family:${DISPLAY};font-weight:900;font-size:20px;text-transform:uppercase;color:${C.ink};">${k}</span><br>
            <span style="font-family:${BODY};font-size:14px;line-height:21px;color:${C.muted};">${v}</span>
          </td>
        </tr>`
          )
          .join("")}
      </table>
      <p style="margin:24px 0 0;font-family:${BODY};font-size:14px;line-height:22px;color:${C.ink2};">
        In a hurry? Just reply to this email.<br>
        <span style="font-family:${MONO};color:${C.ink};">Rahul</span>
      </p>`,
    footer: "Sent because you wrote to me from my site",
  });
};

/** Plain-text versions for clients that don't render HTML. */
export const textForRahul = (name, email, message) =>
  `New letter from ${name} <${email}>\nPosted ${stamp()}\n\n${message}\n\nReply directly to this email to answer them.`;
export const textForSender = (name, message) =>
  `Hi ${name},\n\nYour letter landed. Thanks for writing, I'll reply within a day.\n\nYour message:\n${message}\n\nRahul\n${SITE}`;
