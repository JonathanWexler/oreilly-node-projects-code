import { createTransport } from "nodemailer";

const html = `<html>
<body>
<h1>
Confirm your email
</h1>
</body>
</html>`;

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "jon@jonwexler.com",
    pass: "<YOUR_PASSWORD>",
  },
});

const mailOptions = {
  from: "jon@innbox.jonwexler.com",
  to: "testuser@duck.com",
  subject: "Welcome to Inn Box!",
  html,
};

const sendMail = async () => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (e) {
    console.log(`An error occurred: ${e.message}`);
  }
};

sendMail();
