import type { FastifyRequest, FastifyReply } from "fastify";

import { getAllCards, getSingleCard } from "./cards.service.js";

export const listCards = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const query = request.query as {
    id?: string;
    packId?: string;
    page?: string;
    limit?: string;
    cardName?: string;
    category?: string | string[];
    color?: string | string[];
  };
  const cards = await getAllCards({
    id: query?.id ? query.id : undefined,
    packId: query?.packId ? query.packId : undefined,
    page: query?.page ? Number(query.page) : undefined,
    limit: query?.limit ? Number(query.limit) : undefined,
    cardName: query?.cardName ? query.cardName : undefined,
    category: query?.category ? query.category : undefined,
    color: query?.color ? query.color : undefined,
  });
  return reply.send(cards);
};

export const singleCards = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const query = request.query as {
    imgUrl?: string;
  };

  const card = await getSingleCard({
    imgUrl: query?.imgUrl ? query.imgUrl : undefined,
  });

  return reply.send(card);
};
