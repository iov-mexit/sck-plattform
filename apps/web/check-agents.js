const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAgents() {
  try {
    const agents = await prisma.roleAgent.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        organizationId: true,
        assignedToDid: true
      }
    });
    console.log('Found agents:', agents.length);
    console.log(JSON.stringify(agents, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAgents();
