import nodemailer from "nodemailer";
import { appUrl } from "../config/app";
import dotenv from "dotenv";

dotenv.config();

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  static async sendPasswordResetEmail(
    email: string,
    resetToken: string
  ): Promise<void> {
    const resetUrl = `${appUrl}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@thinkaction.com",
      to: email,
      subject: "Reset Your Password",
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 10 minutes.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
