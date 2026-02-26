import { FastifyReply, FastifyRequest } from "fastify";

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    if (request.user.tokenType && request.user.tokenType !== "access") {
      return reply.code(401).send({ error: "invalid_token_type" });
    }
  } catch {
    return reply.code(401).send({ error: "unauthorized" });
  }
}

export function requireRole(role: string) {
  return async function roleGuard(request: FastifyRequest, reply: FastifyReply) {
    const authResult = await requireAuth(request, reply);
    if (authResult) return authResult;
    if (!request.user || request.user.role !== role) {
      return reply.code(403).send({ error: "forbidden" });
    }
  };
}

