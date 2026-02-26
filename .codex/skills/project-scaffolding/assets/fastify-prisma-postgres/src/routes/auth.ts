import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { hashPassword, hashToken, verifyPassword } from "../lib/security";
import { requireAuth } from "../lib/auth";

function refreshExpiryDate() {
  const days = Number(process.env.REFRESH_TOKEN_DAYS || 7);
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (request, reply) => {
    const body = request.body as {
      email?: string;
      password?: string;
      name?: string;
    };

    if (!body.email || !body.password) {
      return reply.code(400).send({ error: "email_and_password_required" });
    }

    const existing = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });
    if (existing) {
      return reply.code(409).send({ error: "email_already_exists" });
    }

    const user = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        passwordHash: await hashPassword(body.password),
        name: body.name || null,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    return reply.code(201).send({ user });
  });

  app.post("/login", async (request, reply) => {
    const body = request.body as {
      email?: string;
      password?: string;
    };

    if (!body.email || !body.password) {
      return reply.code(400).send({ error: "email_and_password_required" });
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });

    if (!user) {
      return reply.code(401).send({ error: "invalid_credentials" });
    }

    const valid = await verifyPassword(body.password, user.passwordHash);
    if (!valid) {
      return reply.code(401).send({ error: "invalid_credentials" });
    }

    const accessToken = app.jwt.sign(
      { sub: user.id, role: user.role, tokenType: "access" },
      { expiresIn: process.env.ACCESS_TOKEN_TTL || "15m" }
    );
    const refreshToken = app.jwt.sign(
      { sub: user.id, role: user.role, tokenType: "refresh" },
      { expiresIn: process.env.REFRESH_TOKEN_TTL || "7d" }
    );

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: refreshExpiryDate(),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  });

  app.post("/refresh", async (request, reply) => {
    const body = request.body as { refreshToken?: string };
    if (!body.refreshToken) {
      return reply.code(400).send({ error: "refresh_token_required" });
    }

    let payload: { sub: string; role: string; tokenType?: string };
    try {
      payload = app.jwt.verify(body.refreshToken) as {
        sub: string;
        role: string;
        tokenType?: string;
      };
    } catch {
      return reply.code(401).send({ error: "invalid_refresh_token" });
    }

    if (payload.tokenType !== "refresh") {
      return reply.code(401).send({ error: "invalid_token_type" });
    }

    const stored = await prisma.refreshToken.findFirst({
      where: {
        userId: payload.sub,
        tokenHash: hashToken(body.refreshToken),
        revokedAt: null,
      },
    });

    if (!stored || stored.expiresAt < new Date()) {
      return reply.code(401).send({ error: "refresh_token_expired_or_revoked" });
    }

    const accessToken = app.jwt.sign(
      { sub: payload.sub, role: payload.role, tokenType: "access" },
      { expiresIn: process.env.ACCESS_TOKEN_TTL || "15m" }
    );

    return { accessToken };
  });

  app.post("/logout", async (request, reply) => {
    const body = request.body as { refreshToken?: string };
    if (!body.refreshToken) {
      return reply.code(204).send();
    }
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(body.refreshToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return reply.code(204).send();
  });

  app.get("/me", { preHandler: requireAuth }, async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user.sub },
      select: { id: true, email: true, role: true, name: true },
    });
    if (!user) return reply.code(404).send({ error: "user_not_found" });
    return { user };
  });
}

