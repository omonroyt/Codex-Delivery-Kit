import { describe, expect, it } from "vitest";
import { buildServer } from "../src/server";

describe("health endpoints", () => {
  it("returns status ok", async () => {
    const app = buildServer();
    const response = await app.inject({
      method: "GET",
      url: "/health",
    });
    expect(response.statusCode).toBe(200);
    const payload = response.json() as { status: string };
    expect(payload.status).toBe("ok");
    await app.close();
  });
});

