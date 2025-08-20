import { prisma } from './lib/database.js'; prisma.organizations.findMany().then(orgs => { console.log(JSON.stringify(orgs, null, 2)); prisma.$disconnect(); });
