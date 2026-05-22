import { Resend } from "resend";
import type { Mailtype } from "@shared/index.js";

const resend = new Resend(process.env.RESEND_API_KEY);
console.log(process.env.RESEND_API_KEY);

export const sendVerification = async (
  toEmail: string,
  token: string,
): Promise<Mailtype | {}> => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173/";
  const link = `http://localhost:3000/auth/verify?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "TCG-Collection <noreply@finance-tracker.store>",
      to: toEmail,
      subject: "Verifikasi Email Anda",
      html: `<a href="${link}">Verifikasi Email</a>`,
    });

    if (error) {
      console.log("API KEY:", process.env.RESEND_API_KEY);
      console.error("Email error:", error);
      return { success: false, error };
    } else {
      console.log("Email sent:", data);
      return { success: true, data };
    }
  } catch (err) {
    console.error("Send failed:", err);
    return { success: false, err };
  }
};
