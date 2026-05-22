import type { FastifyInstance } from "fastify";
import { registerController, loginController } from "./auth.controller.js";
import verifyEmail from "../utils/verifyEmail.js";

export default async function authRoutes(app: FastifyInstance) {
  app.post("/register", registerController);
  app.post("/login", loginController);
  app.get("/verify", verifyEmail);
}
