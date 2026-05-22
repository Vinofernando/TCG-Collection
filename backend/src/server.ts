import "dotenv/config";
import Fastify from "fastify";
import cardRoutes from "./modules/cards/cards.route.js";
import authRoutes from "./modules/auth/auth.route.js";
import userCollectionRouts from "./modules/user_collection/user_collection.route.js";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import fastifyRedis from "@fastify/redis";

const app = Fastify();

// 1. Register CORS terlebih dahulu
await app.register(cors, {
  origin: ["http://localhost:5173"], // Sesuaikan dengan port Vite kamu
  credentials: true, // WAJIB 'true' agar cookie session bisa dikirim balik oleh browser
  methods: ["GET", "PUT", "POST", "DELETE"],
});

// 2. Register Cookie dan Session SEBELUM Routes
await app.register(fastifyCookie);
await app.register(fastifySession, {
  secret: process.env.SESSION_SECRET || "a-very-long-secret-key-32-chars-min",
  cookieName: "sessionId",
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1800000,
    sameSite: "lax", // Tambahkan ini untuk keamanan ekstra terhadap CSRF
  },
});

// 3. Register Routes (Sekarang rute ini bisa akses session)
app.register(cardRoutes, { prefix: "/card" });
app.register(authRoutes, { prefix: "/auth" });
app.register(userCollectionRouts, { prefix: "/user-collection" });
// app.register(authRoutes, { prefix: "/auth" }); // Rute login/register kamu nanti di sini

app.get("/", async () => {
  return { message: "Inventory API 🚀" };
});

app.listen({ port: 3000, host: "127.0.0.1" });
