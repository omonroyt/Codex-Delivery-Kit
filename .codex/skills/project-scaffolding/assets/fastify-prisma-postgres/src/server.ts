import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { prisma } from "./lib/prisma";
import { authRoutes } from "./routes/auth";
import { paymentRoutes } from "./routes/payments";
import { messageRoutes } from "./routes/messages";
import { adminRoutes } from "./routes/admin";

export function buildServer() {
  const app = Fastify({
    logger: true,
  });

  app.register(cors, {
    origin: true,
  });

  app.register(jwt, {
    secret: process.env.JWT_SECRET || "dev-secret-change-me",
  });

  app.get("/health", async () => {
    return {
      status: "ok",
      service: "fastify-prisma-postgres-api",
    };
  });

  app.get("/health/db", async () => {
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: "ok",
      db: "connected",
    };
  });

  app.register(authRoutes, { prefix: "/auth" });
  app.register(paymentRoutes, { prefix: "/payments" });
  app.register(messageRoutes, { prefix: "/messages" });
  app.register(adminRoutes, { prefix: "/admin" });

  return app;
}

