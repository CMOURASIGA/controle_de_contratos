
import nodemailer from 'nodemailer';

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;

if (!emailUser || !emailPass || !emailHost || !emailPort) {
  console.warn(
    `Email credentials are not set in the .env file. 
     Email sending will be disabled. 
     Please set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS.`
  );
}

export const transporter = nodemailer.createTransport({
  host: emailHost,
  port: parseInt(emailPort || '587', 10),
  secure: parseInt(emailPort || '587', 10) === 465, // true for 465, false for other ports
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

export const mailOptions = {
  from: emailUser,
};

// A simple function to log a warning if email is not configured
export function isEmailConfigured() {
    const isConfigured = emailUser && emailPass && emailHost && emailPort;
    if (!isConfigured) {
        console.warn("Email sending is disabled due to missing configuration.");
    }
    return isConfigured;
}
