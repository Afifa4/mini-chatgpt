import nodemailer from "nodemailer";

const required = ["GOOGLE_USER", "GOOGLE_APP_PASSWORD"];
const missing = required.filter((key) => !process.env[key]);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

if (missing.length > 0) {
  console.warn(`Mail not configured. Missing in .env: ${missing.join(", ")}`);
} else {
  transporter
    .verify()
    .then(() => {
      console.log("Ready for send emails");
    })
    .catch((err) => {
      console.error("Mail verify failed:", err.message);
    });
}

export async function sendEmail({ to, subject, html, text }) {
  if (missing.length > 0) {
    throw new Error(`Mail not configured. Missing: ${missing.join(", ")}`);
  }
  const mailOptions = {
    from: process.env.GOOGLE_USER,
    to,
    subject,
    html,
    text,
  };
  const details = await transporter.sendMail(mailOptions);
  console.log("Email sent to", to);
  return details;
}
