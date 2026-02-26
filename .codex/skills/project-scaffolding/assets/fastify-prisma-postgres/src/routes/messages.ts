import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth";

export async function messageRoutes(app: FastifyInstance) {
  app.post("/send", { preHandler: requireAuth }, async (request, reply) => {
    const body = request.body as {
      channel?: string;
      payload?: string;
    };

    if (!body.payload) {
      return reply.code(400).send({ error: "payload_required" });
    }

    const message = await prisma.message.create({
      data: {
        senderId: request.user.sub,
        channel: body.channel || "in_app",
        payload: body.payload,
        status: "QUEUED",
      },
    });

    return reply.code(201).send({
      message,
      nextAction: "connect_queue_or_provider",
    });
  });
}

