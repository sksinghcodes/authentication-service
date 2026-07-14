import nodemailer from "nodemailer";
import { SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER } from "./env.js";
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

const options: SMTPTransport.Options = {
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(options);

export default transporter;
