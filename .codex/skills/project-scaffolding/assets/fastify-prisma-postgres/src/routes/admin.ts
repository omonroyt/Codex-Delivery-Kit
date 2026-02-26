import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { requireRole } from "../lib/auth";

export async function adminRoutes(app: FastifyInstance) {
  app.get("/users", { preHandler: requireRole("admin") }, async () => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, role: true, createdAt: true },
    });
    return { users };
  });
}

