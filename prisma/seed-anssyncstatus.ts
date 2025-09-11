import { PrismaClient, AnsSyncStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existingStatuses = Object.values(AnsSyncStatus);
  console.log("[SEED] Ensuring AnsSyncStatus values:", existingStatuses);

  for (const status of existingStatuses) {
    await prisma.roleAgent.upsert({
      where: { id: `seed-${status}` },
      update: { approvalStatus: "pending" as any },
      create: {
        id: `seed-${status}`,
        organizationId: "seed-org",
        roleTemplateId: "seed-template",
        assignedToDid: "did:seed:123",
        name: `Seed ${status}`,
        level: 1,
        approvalStatus: "pending" as any,
        ansRegistrationStatus: status as any,
      },
    });
  }

  console.log("[SEED] Completed AnsSyncStatus seeding.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());


