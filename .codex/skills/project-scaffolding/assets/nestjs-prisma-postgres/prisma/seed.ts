import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/common/security";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "admin123456";

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail.toLowerCase() },
  });
  if (existing) {
    console.log("[seed] admin already exists");
    return;
  }

  await prisma.user.create({
    data: {
      email: adminEmail.toLowerCase(),
      passwordHash: await hashPassword(adminPassword),
      role: "admin",
      name: "Admin",
    },
  });
  console.log("[seed] admin created");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

