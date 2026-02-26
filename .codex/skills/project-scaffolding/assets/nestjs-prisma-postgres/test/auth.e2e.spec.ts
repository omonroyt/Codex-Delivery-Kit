import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma.service";

type StoredUser = {
  id: string;
  email: string;
  passwordHash: string;
  role: string;
  name?: string | null;
};

type StoredRefresh = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
};

const usersByEmail = new Map<string, StoredUser>();
const refreshStore: StoredRefresh[] = [];
let userSeq = 0;
let refreshSeq = 0;

const prismaMock = {
  user: {
    findUnique: jest.fn(async ({ where }: { where: { email?: string; id?: string } }) => {
      if (where.email) return usersByEmail.get(where.email) || null;
      if (where.id) {
        return [...usersByEmail.values()].find((item) => item.id === where.id) || null;
      }
      return null;
    }),
    create: jest.fn(
      async ({
        data,
        select,
      }: {
        data: { email: string; passwordHash: string; name?: string | null };
        select?: { id?: boolean; email?: boolean; role?: boolean };
      }) => {
        userSeq += 1;
        const user: StoredUser = {
          id: `u_${userSeq}`,
          email: data.email,
          passwordHash: data.passwordHash,
          role: "user",
          name: data.name || null,
        };
        usersByEmail.set(user.email, user);
        if (select?.id || select?.email || select?.role) {
          return { id: user.id, email: user.email, role: user.role };
        }
        return user;
      }
    ),
  },
  refreshToken: {
    create: jest.fn(
      async ({
        data,
      }: {
        data: { userId: string; tokenHash: string; expiresAt: Date };
      }) => {
        refreshSeq += 1;
        const record: StoredRefresh = {
          id: `rt_${refreshSeq}`,
          userId: data.userId,
          tokenHash: data.tokenHash,
          expiresAt: data.expiresAt,
          revokedAt: null,
        };
        refreshStore.push(record);
        return record;
      }
    ),
    findFirst: jest.fn(
      async ({
        where,
      }: {
        where: { userId: string; tokenHash: string; revokedAt: null };
      }) =>
        refreshStore.find(
          (item) =>
            item.userId === where.userId &&
            item.tokenHash === where.tokenHash &&
            item.revokedAt === null
        ) || null
    ),
    updateMany: jest.fn(
      async ({ where, data }: { where: { tokenHash: string }; data: { revokedAt: Date } }) => {
        let count = 0;
        for (const item of refreshStore) {
          if (item.tokenHash === where.tokenHash && item.revokedAt === null) {
            item.revokedAt = data.revokedAt;
            count += 1;
          }
        }
        return { count };
      }
    ),
  },
};

describe("Auth flow", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    usersByEmail.clear();
    refreshStore.splice(0, refreshStore.length);
    userSeq = 0;
    refreshSeq = 0;
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it("register/login/refresh", async () => {
    const registerResponse = await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email: "test@example.com", password: "strongpass123", name: "Test" });
    expect(registerResponse.status).toBe(201);

    const loginResponse = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "test@example.com", password: "strongpass123" });
    expect(loginResponse.status).toBe(201);
    expect(loginResponse.body.accessToken).toBeTruthy();
    expect(loginResponse.body.refreshToken).toBeTruthy();

    const refreshResponse = await request(app.getHttpServer())
      .post("/auth/refresh")
      .send({ refreshToken: loginResponse.body.refreshToken });
    expect(refreshResponse.status).toBe(201);
    expect(refreshResponse.body.accessToken).toBeTruthy();
  });
});
