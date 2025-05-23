const nodemailer = require("nodemailer");

const sendDoctorCredentialsEmail = async (toEmail, resetToken, doctorName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const frontendUrl=process.env.FRONTEND_URL||"http://localhost:3000";
    const mailOptions = {
      from: `"Your Clinic" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your Doctor Account Credentials",
      html: `
        <h3>Welcome, Dr. ${doctorName}!</h3>
        <p>Your account has been created.</p>
        <p>Please click below to set your password and activate your account:</p>
        <a href="${frontendUrl}/auth/resetPassword?token=${resetToken}">Set Your Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    };
    
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending email:", err.message);
    throw new Error("Email sending failed");
  }
};


const sendUserCredentialsEmail = async (toEmail, resetToken,  userName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const frontendUrl=process.env.FRONTEND_URL||"http://localhost:3000";
    const mailOptions = {
      from: `"Your Clinic" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your Account Credentials",
      html: `
        <h3>Welcome, Dr. ${ userName}!</h3>
        <p>Your account has been created.</p>
        <p>Please click below to set your password and activate your account:</p>
        <a href="${frontendUrl}/doctors/resetPassword?token=${resetToken}">Set Your Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    };
    
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending email:", err.message);
    throw new Error("Email sending failed");
  }
};



const sendForgotPasswordEmail = async (toEmail, resetToken, userName) => {
  try {
     console.log("Sending email to:", toEmail);
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    const mailOptions = {
      from: `"Your Clinic" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Reset Your Password",
      html: `
        <h3>Hello, ${userName}</h3>
        <p>You requested a password reset.</p>
        <p>Please click below to reset your password:</p>
        <a href="${frontendUrl}/auth/resetPassword?token=${resetToken}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    };
 console.log("Mail options:", mailOptions);
    await transporter.sendMail(mailOptions);
    console.log(`Reset password email sent to ${toEmail}`);
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw error; // rethrow to be handled in your controller
  }
};



module.exports =  {sendDoctorCredentialsEmail,sendUserCredentialsEmail,sendForgotPasswordEmail};
