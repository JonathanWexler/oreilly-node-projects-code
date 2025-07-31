import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "jon@jonwexler.com",
    pass: "<YOUR_PASSWORD>",
  },
});

export const sendMail = async (to, html) => {
  const mailOptions = {
    from: "jon@innbox.jonwexler.com",
    to,
    subject: "Email from Inn Box!",
    html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (e) {
    console.log(`An error occurred: ${e.message}`);
  }
};
