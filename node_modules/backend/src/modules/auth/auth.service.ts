import type { UserType, LoginType } from "../../../../shared/index.js";
import { query } from "../../../../shared/supabaseClient.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { sendVerification } from "../utils/email.service.js";

export const register = async (body?: {
  username?: string;
  email?: string;
  password?: string;
}): Promise<UserType | {}> => {
  try {
    const { username, email, password } = body || {};
    if (!email || !password || !username) {
      return {
        success: false,
        message: "Username, email and password must be insert",
      };
    }
    const existingEmail = await query(
      `SELECT user_email FROM users WHERE user_email = $1`,
      [email],
    );

    if (existingEmail.rows.length > 0) {
      return { success: false, message: `Email ${email} already registered` };
    }

    const verifiedToken = uuidv4();
    const hashedPass = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO USERS(user_name, user_email, user_password, verified_token) VALUES($1, $2, $3, $4) RETURNING *`,
      [username, email, hashedPass, verifiedToken],
    );

    await sendVerification(email, verifiedToken);
    return { success: true, message: result.rows[0] };
  } catch (err) {
    if (err instanceof Error) {
      return { success: false, message: "Gagal registrasi", err: err.message };
    }
    return { success: false, message: "Gagal registrasi", err: String(err) };
  }
};

export const login = async (body?: {
  email?: string;
  password?: string;
}): Promise<LoginType> => {
  // Gunakan interface yang pasti
  try {
    const { email, password } = body || {};

    if (!email || !password) {
      return { success: false, message: "Email dan password harus diisi" };
    }

    const result = await query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return { success: false, message: "User tidak ditemukan" };
    }

    const isMatch = await bcrypt.compare(password, user.user_password);
    if (!isMatch) {
      return { success: false, message: "Password salah" };
    }

    return {
      success: true,
      message: "Login berhasil",
      user: { id: user.id, email: user.user_email, username: user.username },
    };
  } catch (err) {
    return { success: false, message: "Internal server error" };
  }
};
