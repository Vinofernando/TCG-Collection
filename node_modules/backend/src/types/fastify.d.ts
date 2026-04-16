import "@fastify/session";

declare module "@fastify/session" {
  interface FastifySessionObject {
    user?: {
      id: string;
      email: string;
      username: string;
    };
  }
}
