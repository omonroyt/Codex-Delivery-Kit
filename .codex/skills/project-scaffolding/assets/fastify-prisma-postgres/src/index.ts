import "dotenv/config";
import { buildServer } from "./server";
import { prisma } from "./lib/prisma";

async function main() {
  const app = buildServer();
  const port = Number(process.env.PORT || 3001);
  const host = "0.0.0.0";

  await app.listen({ port, host });
}

main().catch((error) => {
  console.error(error);
  prisma.$disconnect().catch(() => undefined);
  process.exit(1);
});
