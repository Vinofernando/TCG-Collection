import { FastifyReply, FastifyRequest } from "fastify";
import { query } from "../../../../shared/supabaseClient.js";

interface VerifyEmailQuery {
  token: string;
}
export default async function verifyEmail(
  request: FastifyRequest<{ Querystring: VerifyEmailQuery }>,
  reply: FastifyReply,
) {
  try {
    const { token } = request.query as VerifyEmailQuery;

    if (!token) {
      return reply
        .status(400)
        .send({ success: false, message: "Token is required" });
    }

    const searchEmail = await query(
      `SELECT user_email FROM users WHERE verified_token = $1`,
      [token],
    );

    if (searchEmail.rows.length === 0) {
      return reply
        .status(404)
        .send({ success: false, message: "Email not found" });
    }

    await query(
      `UPDATE users SET is_verified = $1, verified_token = $2 WHERE verified_token = $3`,
      [true, null, token],
    );

    return reply
      .status(200)
      .send({ success: true, message: "Email successfully verified!" });
  } catch (err) {
    console.error(err);
    return reply
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
}
