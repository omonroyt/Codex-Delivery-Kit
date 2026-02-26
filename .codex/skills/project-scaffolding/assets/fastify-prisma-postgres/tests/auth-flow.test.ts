import { beforeEach, describe, expect, it, vi } from "vitest";

type StoredUser = {
  id: string;
  email: string;
  passwordHash: string;
  role: string;
  name: string | null;
};

type StoredRefreshToken = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
};

const usersByEmail = new Map<string, StoredUser>();
const usersById = new Map<string, StoredUser>();
const refreshTokens: StoredRefreshToken[] = [];
let userSeq = 0;
let refreshSeq = 0;

vi.mock("../src/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(async ({ where }: { where: { email?: string; id?: string } }) => {
        if (where.email) return usersByEmail.get(where.email) || null;
        if (where.id) return usersById.get(where.id) || null;
        return null;
      }),
      create: vi.fn(async ({ data }: { data: { email: string; passwordHash: string; name?: string | null } }) => {
        userSeq += 1;
        const user: StoredUser = {
          id: `u_${userSeq}`,
          email: data.email,
          passwordHash: data.passwordHash,
          role: "user",
          name: data.name || null,
        };
        usersByEmail.set(user.email, user);
        usersById.set(user.id, user);
        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      }),
    },
    refreshToken: {
      create: vi.fn(
        async ({
          data,
        }: {
          data: { userId: string; tokenHash: string; expiresAt: Date };
        }) => {
          refreshSeq += 1;
          const item: StoredRefreshToken = {
            id: `rt_${refreshSeq}`,
            userId: data.userId,
            tokenHash: data.tokenHash,
            expiresAt: data.expiresAt,
            revokedAt: null,
          };
          refreshTokens.push(item);
          return item;
        }
      ),
      findFirst: vi.fn(
        async ({
          where,
        }: {
          where: { userId: string; tokenHash: string; revokedAt: null };
        }) =>
          refreshTokens.find(
            (token) =>
              token.userId === where.userId &&
              token.tokenHash === where.tokenHash &&
              token.revokedAt === null
          ) || null
      ),
      updateMany: vi.fn(
        async ({ where, data }: { where: { tokenHash: string }; data: { revokedAt: Date } }) => {
          let count = 0;
          for (const token of refreshTokens) {
            if (token.tokenHash === where.tokenHash && token.revokedAt === null) {
              token.revokedAt = data.revokedAt;
              count += 1;
            }
          }
          return { count };
        }
      ),
    },
    $queryRaw: vi.fn(async () => 1),
  },
}));

import { buildServer } from "../src/server";

describe("auth flow", () => {
  beforeEach(() => {
    usersByEmail.clear();
    usersById.clear();
    refreshTokens.splice(0, refreshTokens.length);
    userSeq = 0;
    refreshSeq = 0;
  });

  it("register/login/refresh/me", async () => {
    const app = buildServer();

    const registerResponse = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        email: "test@example.com",
        password: "strongpass123",
        name: "Test",
      },
    });
    expect(registerResponse.statusCode).toBe(201);

    const loginResponse = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        email: "test@example.com",
        password: "strongpass123",
      },
    });
    expect(loginResponse.statusCode).toBe(200);
    const loginBody = loginResponse.json() as {
      accessToken: string;
      refreshToken: string;
    };
    expect(loginBody.accessToken).toBeTruthy();
    expect(loginBody.refreshToken).toBeTruthy();

    const refreshResponse = await app.inject({
      method: "POST",
      url: "/auth/refresh",
      payload: {
        refreshToken: loginBody.refreshToken,
      },
    });
    expect(refreshResponse.statusCode).toBe(200);
    expect((refreshResponse.json() as { accessToken: string }).accessToken).toBeTruthy();

    const meResponse = await app.inject({
      method: "GET",
      url: "/auth/me",
      headers: {
        authorization: `Bearer ${loginBody.accessToken}`,
      },
    });
    expect(meResponse.statusCode).toBe(200);
    expect((meResponse.json() as { user: { email: string } }).user.email).toBe("test@example.com");

    await app.close();
  });
});
