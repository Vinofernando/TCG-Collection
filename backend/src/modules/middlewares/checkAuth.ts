import { FastifyRequest, FastifyReply } from "fastify";

export default async function checkAuth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (!request.session.user) {
    reply.status(401).send({
      success: false,
      message: "Kamu belum login/sesi sudah habis",
    });
    return;
  }

  return;
}
