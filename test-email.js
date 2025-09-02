const nodemailer = require("nodemailer");

async function testEmail() {
  console.log("🔍 Testing SMTP configuration with Hostinger...");
  
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: "mehdi@tonexora.com",
      pass: "Torehrami123$",
    },
    debug: true,
    logger: true
  });

  try {
    console.log("📧 Sending test email to mehdi.lakhdhar2020@gmail.com...");
    const info = await transporter.sendMail({
      from: "mehdi@tonexora.com",
      to: "mehdi.lakhdhar2020@gmail.com",
      subject: "Test SMTP - Deceased Status App",
      text: "Test email from deceased status app. SMTP is working!",
      html: "<h2>✅ SMTP Test Success</h2><p>Your SMTP configuration is working correctly!</p><p>Sent via Hostinger SMTP</p>"
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
  } catch (error) {
    console.error("❌ SMTP Error:", error.message);
    if (error.code) console.error("Error code:", error.code);
    if (error.response) console.error("Server response:", error.response);
  }
}

testEmail();
