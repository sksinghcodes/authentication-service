import { FRONTEND_URL, SMTP_USER } from "../config/env.js";
import transporter from "../config/nodemailer.js";

const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: SMTP_USER,
    to: email,
    subject: "Verify your email",
    text: `Click the following link to verify your email:\n\n${verificationUrl} \n\n This link is valid for next 10 minutes`,
  });
};

const sendPasswordResetEmail = async (email: string, token: string) => {
  const verificationUrl = `${FRONTEND_URL}/reset_forgotten_password?token=${token}`;
  await transporter.sendMail({
    from: SMTP_USER,
    to: email,
    subject: "Reset your password",
    text: `Click the following link to reset you password:\n\n${verificationUrl} \n\n This link is valid for next 10 minutes`,
  });
};

const emailService = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};

export default emailService;
