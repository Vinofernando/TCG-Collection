import type { FastifyRequest, FastifyReply } from "fastify";

import { getUserCollection } from "./user_collection.service.js";

export const userCollection = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const currentUserId = request.session.user!.id;

  console.log(currentUserId);
  if (!currentUserId) {
    reply.status(401).send({
      success: false,
      message: "User not found",
    });
  }
  const query = request.query as {
    page?: number;
  };

  const collection = await getUserCollection(currentUserId, query?.page);

  console.log(collection);
  return reply.send({
    success: true,
    data: collection,
  });
};
