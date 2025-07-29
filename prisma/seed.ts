import { PrismaClient } from '../apps/web/generated/prisma';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

const prisma = new PrismaClient();

async function main() {
  console.log(chalk.blue('🌱 Starting database seed...'));

  // Use process.cwd() and relative path - works in all environments
  const roleTemplatesPath = path.join(process.cwd(), 'prisma', 'roleTemplates.seed.json');
  if (!fs.existsSync(roleTemplatesPath)) {
    throw new Error(chalk.red(`🚨 roleTemplates.seed.json not found at: ${roleTemplatesPath}`));
  }
  const roleTemplatesData = JSON.parse(fs.readFileSync(roleTemplatesPath, 'utf8'));

  // Validate JSON
  if (!Array.isArray(roleTemplatesData)) {
    throw new Error(chalk.red('🚨 Invalid roleTemplates.seed.json format: Expected an array'));
  }

  // Create a sample organization
  const organization = await prisma.organization.upsert({
    where: { domain: 'cyberlab-ad.com' },
    update: {},
    create: {
      name: 'CyberLab AD',
      description: 'Advanced cybersecurity research and development organization',
      domain: 'cyberlab-ad.com',
    },
  });

  console.log(chalk.green(`✅ Created organization: ${organization.name}`));

  // Create role templates
  for (const templateData of roleTemplatesData) {
    const roleTemplate = await prisma.roleTemplate.upsert({
      where: {
        id: templateData.id
      },
      update: {
        title: templateData.title,
        focus: templateData.focus,
        category: templateData.category,
        selectable: templateData.selectable,
        responsibilities: templateData.responsibilities,
        securityContributions: templateData.securityContributions,
        organizationId: organization.id,
      },
      create: {
        id: templateData.id,
        title: templateData.title,
        focus: templateData.focus,
        category: templateData.category,
        selectable: templateData.selectable,
        responsibilities: templateData.responsibilities,
        securityContributions: templateData.securityContributions,
        organizationId: organization.id,
      },
    });

    console.log(chalk.green(`✅ Created role template: ${roleTemplate.title}`));
  }

  // Create a sample digital twin
  const frontendRole = await prisma.roleTemplate.findUnique({
    where: { id: 'frontend-developer' },
  });

  if (frontendRole) {
    const digitalTwin = await prisma.digitalTwin.create({
      data: {
        name: 'Alice Frontend Developer Twin',
        description: 'Digital twin for Alice as Frontend Developer',
        organizationId: organization.id,
        roleTemplateId: frontendRole.id,
        assignedToDid: 'did:ethr:0x1234567890123456789012345678901234567890',
        blockchainAddress: '0x1234567890123456789012345678901234567890',
        blockchainNetwork: 'ethereum',
        level: 1,
      },
    });

    console.log(chalk.green(`✅ Created digital twin: ${digitalTwin.name}`));

    // Add some sample signals
    const signals = await Promise.all([
      prisma.signal.create({
        data: {
          type: 'certification',
          title: 'React Security Certification',
          description: 'Completed React security best practices course',
          value: 100,
          source: 'Coursera',
          verified: true,
          digitalTwinId: digitalTwin.id,
          metadata: {
            courseId: 'react-security-101',
            completionDate: new Date().toISOString(),
            score: 95,
          },
        },
      }),
      prisma.signal.create({
        data: {
          type: 'activity',
          title: 'Security Code Review',
          description: 'Completed 50 security-focused code reviews',
          value: 50,
          source: 'GitHub',
          verified: true,
          digitalTwinId: digitalTwin.id,
          metadata: {
            repository: 'cyberlab-ad/frontend',
            reviewCount: 50,
            averageScore: 4.2,
          },
        },
      }),
    ]);

    console.log(chalk.green(`✅ Created ${signals.length} signals for digital twin`));

    // Add a sample certification
    const certification = await prisma.certification.create({
      data: {
        name: 'OWASP Frontend Security',
        issuer: 'OWASP Foundation',
        issuedAt: new Date('2024-01-15'),
        expiresAt: new Date('2025-01-15'),
        credentialUrl: 'https://owasp.org/certificates/frontend-security',
        verified: true,
        digitalTwinId: digitalTwin.id,
      },
    });

    console.log(chalk.green(`✅ Created certification: ${certification.name}`));
  }

  console.log(chalk.blue('🎉 Database seeding completed successfully!'));
}

main()
  .catch((e) => {
    console.error(chalk.red('❌ Error during seeding:'), e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 