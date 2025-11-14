import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const branch = await prisma.branch.upsert({
    where: { id: "default-branch" },
    update: {},
    create: { id: "default-branch", name: "Main Branch", address: "Ulaanbaatar" }
  });

  const adminPass = process.env.ADMIN_PASSWORD || "Admin123!ChangeMe";
  const hash = await bcrypt.hash(adminPass, 10);

  await prisma.user.upsert({
    where: { email: "admin@mdent.cloud" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@mdent.cloud",
      role: "ADMIN",
      branchId: branch.id,
      passwordHash: hash,
      isActive: true
    }
  });

  console.log("Seed complete. Admin:", "admin@mdent.cloud", "Password:", adminPass);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
