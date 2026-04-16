import type { FastifyInstance } from "fastify";
import { listCards, singleCards } from "./cards.controller.js";

export default async function cardRoutes(app: FastifyInstance) {
  app.get("/", listCards);
  app.get("/series", singleCards);
}
