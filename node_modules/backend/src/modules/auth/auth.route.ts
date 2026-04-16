import type { FastifyInstance } from "fastify";
import { registerController, loginController } from "./auth.controller.js";

export default async function authRoutes(app: FastifyInstance) {
  app.post("/register", registerController);
  app.post("/login", loginController);
}
