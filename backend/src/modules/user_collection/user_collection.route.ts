import type { FastifyInstance } from "fastify";
import { userCollection } from "./user_collection.controller.js";
import checkAuth from "../middlewares/checkAuth.js";

export default async function userCollectionRouts(app: FastifyInstance) {
  app.get("/", { preHandler: [checkAuth] }, userCollection);
}
