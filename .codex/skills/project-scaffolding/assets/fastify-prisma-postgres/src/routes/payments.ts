import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth";

export async function paymentRoutes(app: FastifyInstance) {
  app.post("/checkout", { preHandler: requireAuth }, async (request, reply) => {
    const body = request.body as {
      amount?: number;
      currency?: string;
      provider?: string;
    };
    if (!body.amount || body.amount <= 0) {
      return reply.code(400).send({ error: "invalid_amount" });
    }

    const payment = await prisma.payment.create({
      data: {
        userId: request.user.sub,
        amount: Math.round(body.amount),
        currency: body.currency || "USD",
        provider: body.provider || "mock",
        status: "PENDING",
      },
    });

    return reply.code(201).send({
      payment,
      nextAction: "connect_real_payment_provider",
    });
  });
}

