import { PrismaClient } from '../../node_modules/@prisma/client';

const prisma = new PrismaClient();

async function seedData() {
  console.log('🌱 Updating database with privacy-first data...');

  try {
    // Find existing organization or create new one
    let organization = await prisma.organization.findUnique({
      where: { domain: 'securecodecorp.com' },
    });

    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          name: 'SecureCodeCorp',
          description: 'A leading cybersecurity company',
          domain: 'securecodecorp.com',
          isActive: true,
        },
      });
      console.log('✅ Created organization:', organization.name);
    } else {
      console.log('✅ Using existing organization:', organization.name);
    }

    // Clear existing digital twins to replace with privacy-first versions
    console.log('🗑️ Clearing existing digital twins and related data...');

    // Delete in correct order to handle foreign key constraints
    await prisma.signal.deleteMany({
      where: {
        digitalTwin: {
          organizationId: organization.id
        }
      },
    });
    await prisma.certification.deleteMany({
      where: {
        digitalTwin: {
          organizationId: organization.id
        }
      },
    });
    await prisma.blockchainTransaction.deleteMany({
      where: {
        digitalTwin: {
          organizationId: organization.id
        }
      },
    });
    await prisma.digitalTwin.deleteMany({
      where: { organizationId: organization.id },
    });

    // Create sample role templates
    const roleTemplates = await Promise.all([
      prisma.roleTemplate.create({
        data: {
          title: 'Security Engineer',
          focus: 'Application Security',
          category: 'Security',
          selectable: true,
          responsibilities: [
            'Conduct security code reviews',
            'Implement secure coding practices',
            'Perform vulnerability assessments',
            'Develop security tools and automation'
          ],
          securityContributions: [
            {
              title: 'Code Review Excellence',
              bullets: [
                'Reviewed 50+ pull requests for security issues',
                'Identified and fixed 15 critical vulnerabilities',
                'Mentored 3 junior developers on secure coding'
              ]
            },
            {
              title: 'Security Tool Development',
              bullets: [
                'Built automated security scanning pipeline',
                'Created custom SAST rules for company standards',
                'Developed security training modules'
              ]
            }
          ],
          organizationId: organization.id,
        },
      }),
      prisma.roleTemplate.create({
        data: {
          title: 'DevOps Engineer',
          focus: 'Infrastructure Security',
          category: 'DevOps',
          selectable: true,
          responsibilities: [
            'Secure infrastructure deployment',
            'Implement CI/CD security practices',
            'Monitor security compliance',
            'Manage access controls'
          ],
          securityContributions: [
            {
              title: 'Infrastructure Security',
              bullets: [
                'Implemented zero-trust network architecture',
                'Set up automated security monitoring',
                'Reduced security incidents by 60%'
              ]
            }
          ],
          organizationId: organization.id,
        },
      }),
    ]);

    console.log('✅ Created role templates:', roleTemplates.length);

    // Create privacy-first digital twins (DIDs only, no PII)
    const digitalTwins = await Promise.all([
      prisma.digitalTwin.create({
        data: {
          name: 'Security Engineer Digital Twin',
          description: 'Digital twin for security engineering role',
          blockchainAddress: '0x1234567890123456789012345678901234567890',
          soulboundTokenId: '1',
          blockchainNetwork: 'ethereum',
          status: 'active',
          level: 3,
          organizationId: organization.id,
          roleTemplateId: roleTemplates[0].id,
          assignedToDid: 'did:ethr:0x1234567890123456789012345678901234567890',
        },
      }),
      prisma.digitalTwin.create({
        data: {
          name: 'DevOps Engineer Digital Twin',
          description: 'Digital twin for DevOps engineering role',
          blockchainAddress: '0x2345678901234567890123456789012345678901',
          soulboundTokenId: '2',
          blockchainNetwork: 'sepolia',
          status: 'active',
          level: 2,
          organizationId: organization.id,
          roleTemplateId: roleTemplates[1].id,
          assignedToDid: 'did:ethr:0x2345678901234567890123456789012345678901',
        },
      }),
    ]);

    console.log('✅ Created privacy-first digital twins:', digitalTwins.length);

    // Create sample signals (achievements only, no personal data)
    const signals = await Promise.all([
      prisma.signal.create({
        data: {
          type: 'certification',
          title: 'AWS Security Specialty',
          description: 'Achieved AWS Security Specialty certification',
          metadata: {
            issuer: 'Amazon Web Services',
            issuedAt: new Date('2024-01-15'),
            credentialUrl: 'https://aws.amazon.com/certification/',
          },
          value: 100,
          source: 'AWS',
          url: 'https://aws.amazon.com/certification/',
          verified: true,
          digitalTwinId: digitalTwins[0].id,
        },
      }),
      prisma.signal.create({
        data: {
          type: 'achievement',
          title: 'Security Code Review Master',
          description: 'Completed 100 security code reviews',
          metadata: {
            reviewsCompleted: 100,
            vulnerabilitiesFound: 25,
            teamMembersMentored: 5,
          },
          value: 100,
          source: 'Internal',
          verified: true,
          digitalTwinId: digitalTwins[0].id,
        },
      }),
      prisma.signal.create({
        data: {
          type: 'activity',
          title: 'Zero Trust Implementation',
          description: 'Successfully implemented zero-trust architecture',
          metadata: {
            projectDuration: '6 months',
            teamSize: 8,
            costSavings: '$50,000',
          },
          value: 85,
          source: 'Internal',
          verified: true,
          digitalTwinId: digitalTwins[1].id,
        },
      }),
    ]);

    console.log('✅ Created signals:', signals.length);

    // Create sample certifications (no personal data)
    const certifications = await Promise.all([
      prisma.certification.create({
        data: {
          name: 'Certified Information Systems Security Professional (CISSP)',
          issuer: 'ISC²',
          issuedAt: new Date('2023-06-15'),
          expiresAt: new Date('2026-06-15'),
          credentialUrl: 'https://www.isc2.org/certifications/cissp',
          verified: true,
          digitalTwinId: digitalTwins[0].id,
        },
      }),
      prisma.certification.create({
        data: {
          name: 'Kubernetes Administrator (CKA)',
          issuer: 'Cloud Native Computing Foundation',
          issuedAt: new Date('2023-09-20'),
          expiresAt: new Date('2026-09-20'),
          credentialUrl: 'https://www.cncf.io/certification/cka/',
          verified: true,
          digitalTwinId: digitalTwins[1].id,
        },
      }),
    ]);

    console.log('✅ Created certifications:', certifications.length);

    // Create sample blockchain transactions
    const transactions = await Promise.all([
      prisma.blockchainTransaction.create({
        data: {
          transactionHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
          network: 'ethereum',
          blockNumber: 18500000,
          gasUsed: '150000',
          gasPrice: '20000000000',
          status: 'confirmed',
          digitalTwinId: digitalTwins[0].id,
        },
      }),
      prisma.blockchainTransaction.create({
        data: {
          transactionHash: '0x2345678901234567890123456789012345678901234567890123456789012345',
          network: 'sepolia',
          blockNumber: 45000000,
          gasUsed: '200000',
          gasPrice: '30000000000',
          status: 'confirmed',
          digitalTwinId: digitalTwins[1].id,
        },
      }),
    ]);

    console.log('✅ Created blockchain transactions:', transactions.length);

    console.log('🎉 Privacy-first data update completed successfully!');
    console.log('');
    console.log('✅ All data now follows privacy-first principles:');
    console.log('   - No personal names or identifiers');
    console.log('   - Only DIDs for identity');
    console.log('   - Role-based digital twins');
    console.log('   - Achievement-focused signals');
    console.log('');
    console.log('Updated data:');
    console.log(`- Organization: ${organization.name}`);
    console.log(`- Role Templates: ${roleTemplates.length}`);
    console.log(`- Digital Twins: ${digitalTwins.length} (DIDs only, no PII)`);
    console.log(`- Signals: ${signals.length} (achievements only)`);
    console.log(`- Certifications: ${certifications.length} (professional credentials)`);
    console.log(`- Blockchain Transactions: ${transactions.length}`);

  } catch (error) {
    console.error('❌ Error updating database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData(); 