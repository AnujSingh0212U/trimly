import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default" },
    update: {},
  });

  console.log("Seed completed: site settings initialized");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
