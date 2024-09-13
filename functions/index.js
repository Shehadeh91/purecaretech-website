const functions = require("firebase-functions/v2/https");
const nodemailer = require("nodemailer");

// Create a transporter object with your Gmail credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "admin@purecaretech.com", // Your email
    pass: "xkqg ewni cjed drqd", // Your password or app-specific password
  },
});

// Define the Cloud Function to receive email
exports.receiveEmails = functions.onRequest((req, res) => {
  const {name, phone, email, service} = req.body;

  // Set up email options
  const mailOptions = {
    from: email,
    to: "admin@purecaretech.com",
    subject: `New Agent Registration from ${name}`,
    text: `
      Name: ${name}
      Phone: ${phone}
      Email: ${email}
      Service: ${service}
    `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Error sending email.");
    }
    console.log("Email sent:", info.response);
    return res.status(200).send("Email sent successfully!");
  });
});
