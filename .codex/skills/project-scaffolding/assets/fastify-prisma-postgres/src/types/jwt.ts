import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      role: string;
      tokenType?: "access" | "refresh";
    };
    user: {
      sub: string;
      role: string;
      tokenType?: "access" | "refresh";
    };
  }
}

