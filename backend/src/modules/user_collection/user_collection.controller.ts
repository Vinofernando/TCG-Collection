import type { FastifyRequest, FastifyReply } from "fastify";

import { addCollection, getUserCollection } from "./user_collection.service.js";

export const userCollection = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const currentUserId = request.session.user!.id;

  if (!currentUserId) {
    reply.status(401).send({
      success: false,
      message: "User not found",
    });
  }
  const query = request.query as {
    page?: number;
    limit?: number;
  };

  const collection = await getUserCollection(
    currentUserId,
    query?.page,
    query?.limit,
  );

  console.log(collection);
  return reply.send({
    success: true,
    data: collection,
  });
};

export const addUserCollection = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const currentUserId = request.session.user!.id;

  if (!currentUserId) {
    reply.status(401).send({
      success: false,
      message: "User not found",
    });
  }

  const query = request.query as {
    cardId: string;
  };

  if (!query.cardId) {
    return reply.status(401).send({
      success: false,
      messagge: "cardId tidak ditemukan",
    });
  }
  const successAdd = await addCollection(currentUserId, query.cardId);

  return reply.send({
    success: true,
    data: successAdd,
  });
};
