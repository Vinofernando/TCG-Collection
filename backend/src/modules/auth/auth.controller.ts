import type { FastifyRequest, FastifyReply } from "fastify";
import { register, login } from "./auth.service.js";

declare module "fastify" {
  interface FastifySessionObject {
    user?: {
      id: number;
      email: string;
      username: string;
    };
  }
}

export const registerController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const body = request.body as {
    username?: string;
    email?: string;
    password?: string;
  };
  const result = await register({
    username: body?.username ? body.username : undefined,
    email: body?.email ? body.email : undefined,
    password: body?.password ? body.password : undefined,
  });
  return reply.send(result);
};

export const loginController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const body = request.body as {
    email?: string;
    password?: string;
  };

  const result = await login({
    email: body.email,
    password: body.password,
  });

  if (!result.success) {
    return reply.status(401).send(result);
  }

  if (result.user) {
    request.session.user = {
      id: result.user.id,
      email: result.user.email,
      username: result.user.username,
    };
  }

  return reply.send({ success: true, message: "Login berhasil" });
};
