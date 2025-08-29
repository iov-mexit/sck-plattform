#!/usr/bin/env node

/**
 * SCK Platform Comprehensive Deployment Seeding Script
 * Ensures ALL platform data is populated during deployment
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deploySeed() {
  console.log('🌱 Starting SCK Platform comprehensive deployment seeding...');
  console.log('==========================================================');

  try {
    // Phase 1: Foundation Data (Critical)
    console.log('\n📋 PHASE 1: Foundation Data');
    console.log('============================');

    const organization = await seedOrganizations();
    await seedRoleTemplates();
    await seedBasicTrustThresholds();
    await seedLoAPolicies(organization.id);

    // Phase 2: Governance & Compliance (Important)
    console.log('\n📋 PHASE 2: Governance & Compliance');
    console.log('====================================');

    await seedComprehensiveTrustThresholds(organization.id);
    await seedMcpPolicies(organization.id);

    // Phase 3: Demonstration & Knowledge (Enhancement)
    console.log('\n📋 PHASE 3: Demonstration & Knowledge');
    console.log('=======================================');

    await seedSampleRoleAgents(organization.id);
    await seedSampleSignals();
    await seedSampleCertifications();
    await seedRagKnowledgeBase();

    console.log('\n🎉 SCK Platform comprehensive seeding completed successfully!');
    console.log('✅ All data categories populated and ready for production use');

  } catch (error) {
    console.error('❌ Deployment seeding failed:', error.message);
    console.log('🔄 Attempting fallback seeding...');

    try {
      await fallbackSeeding();
      console.log('✅ Fallback seeding completed');
    } catch (fallbackError) {
      console.error('❌ Fallback seeding also failed:', fallbackError.message);
      process.exit(1);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// =============================================================================
// PHASE 1: Foundation Data
// =============================================================================

async function seedOrganizations() {
  console.log('🏢 Seeding organizations...');

  const organization = await prisma.organization.upsert({
    where: { domain: 'securecodecorp.com' },
    update: {},
    create: {
      id: 'org-securecodecorp',
      name: 'SecureCodeCorp',
      description: 'Leading cybersecurity consulting and development organization',
      domain: 'securecodecorp.com',
      isActive: true,
      onboardingComplete: true,
      complianceTags: ['SOC2', 'ISO27001', 'GDPR'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  console.log(`✅ Organization: ${organization.name} (${organization.domain})`);
  return organization;
}

async function seedRoleTemplates() {
  console.log('👥 Seeding role templates...');

  const existingCount = await prisma.roleTemplate.count();
  if (existingCount > 0) {
    console.log(`✅ Role templates already exist (${existingCount} found) - skipping`);
    return;
  }

  console.log('📝 No role templates found - running comprehensive seed...');

  try {
    const { execSync } = require('child_process');
    execSync('npx tsx seed-comprehensive-26.ts', {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log('✅ Comprehensive role templates seeded successfully');
  } catch (seedError) {
    console.error('❌ Comprehensive seed failed:', seedError.message);
    console.log('🔄 Creating basic role templates as fallback...');
    await createBasicRoleTemplates();
  }
}

async function createBasicRoleTemplates() {
  const basicTemplates = [
    {
      id: 'role-security-engineer',
      title: 'Security Engineer',
      focus: 'Cybersecurity Implementation',
      category: 'Security',
      selectable: true,
      responsibilities: [
        'Implement security controls',
        'Conduct security assessments',
        'Monitor security events',
        'Respond to security incidents'
      ],
      securityContributions: [
        {
          title: 'Security Controls',
          bullets: [
            'Implement access controls',
            'Configure security monitoring',
            'Deploy security tools',
            'Maintain security policies'
          ]
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'role-devops-engineer',
      title: 'DevOps Engineer',
      focus: 'Infrastructure & Automation',
      category: 'DevOps',
      selectable: true,
      responsibilities: [
        'Manage infrastructure',
        'Automate deployments',
        'Monitor system health',
        'Ensure security compliance'
      ],
      securityContributions: [
        {
          title: 'Infrastructure Security',
          bullets: [
            'Secure CI/CD pipelines',
            'Implement infrastructure as code',
            'Monitor security vulnerabilities',
            'Automate security testing'
          ]
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  for (const template of basicTemplates) {
    await prisma.roleTemplate.create({ data: template });
  }

  console.log(`✅ Created ${basicTemplates.length} basic role templates`);
}

async function seedBasicTrustThresholds() {
  console.log('🎯 Seeding basic trust thresholds...');

  const existingCount = await prisma.roleTrustThreshold.count();
  if (existingCount > 0) {
    console.log(`✅ Trust thresholds already exist (${existingCount} found) - skipping`);
    return;
  }

  const organization = await prisma.organization.findFirst();
  if (!organization) {
    console.log('⚠️ No organization found - skipping trust thresholds');
    return;
  }

  const basicThresholds = [
    { roleTitle: 'Security Engineer', minTrustScore: 80 },
    { roleTitle: 'DevOps Engineer', minTrustScore: 75 },
    { roleTitle: 'Developer', minTrustScore: 70 }
  ];

  for (const threshold of basicThresholds) {
    await prisma.roleTrustThreshold.upsert({
      where: {
        organizationId_roleTitle: {
          organizationId: organization.id,
          roleTitle: threshold.roleTitle
        }
      },
      update: { minTrustScore: threshold.minTrustScore },
      create: {
        organizationId: organization.id,
        roleTitle: threshold.roleTitle,
        minTrustScore: threshold.minTrustScore,
        isActive: true
      }
    });
  }

  console.log(`✅ Created ${basicThresholds.length} basic trust thresholds`);
}

async function seedLoAPolicies(organizationId) {
  console.log('📋 Seeding LoA policies...');

  const existingCount = await prisma.loaPolicy.count({
    where: { organizationId }
  });

  if (existingCount > 0) {
    console.log(`✅ LoA policies already exist (${existingCount} found) - skipping`);
    return;
  }

  const defaultLoAPolicies = [
    {
      artifactType: 'RoleAgent',
      level: 1,
      minReviewers: 1,
      requiredFacets: ['TECHNICAL'],
      externalRequired: false,
      description: 'Basic role agent creation - single technical review'
    },
    {
      artifactType: 'RoleAgent',
      level: 2,
      minReviewers: 2,
      requiredFacets: ['TECHNICAL', 'BUSINESS'],
      externalRequired: false,
      description: 'Standard role agent - technical and business review'
    },
    {
      artifactType: 'RoleAgent',
      level: 3,
      minReviewers: 3,
      requiredFacets: ['TECHNICAL', 'BUSINESS', 'SECURITY'],
      externalRequired: false,
      description: 'Advanced role agent - comprehensive review'
    },
    {
      artifactType: 'MCP',
      level: 1,
      minReviewers: 2,
      requiredFacets: ['TECHNICAL', 'SECURITY'],
      externalRequired: false,
      description: 'Basic MCP policy - technical and security review'
    },
    {
      artifactType: 'MCP',
      level: 2,
      minReviewers: 3,
      requiredFacets: ['TECHNICAL', 'SECURITY', 'COMPLIANCE'],
      externalRequired: false,
      description: 'Standard MCP policy - comprehensive review'
    }
  ];

  for (const policyData of defaultLoAPolicies) {
    await prisma.loaPolicy.create({
      data: {
        organizationId,
        ...policyData,
        isActive: true
      }
    });
  }

  console.log(`✅ Created ${defaultLoAPolicies.length} LoA policies`);
}

// =============================================================================
// PHASE 2: Governance & Compliance
// =============================================================================

async function seedComprehensiveTrustThresholds(organizationId) {
  console.log('🎯 Seeding comprehensive trust thresholds...');

  try {
    const { execSync } = require('child_process');
    execSync('npx tsx seed-comprehensive-trust-thresholds.ts', {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log('✅ Comprehensive trust thresholds seeded successfully');
  } catch (seedError) {
    console.error('❌ Comprehensive trust thresholds failed:', seedError.message);
    console.log('🔄 Skipping comprehensive thresholds - basic ones already created');
  }
}

async function seedMcpPolicies(organizationId) {
  console.log('🤖 Seeding MCP policies...');

  const existingCount = await prisma.mcpPolicy.count({
    where: { organizationId }
  });

  if (existingCount > 0) {
    console.log(`✅ MCP policies already exist (${existingCount} found) - skipping`);
    return;
  }

  const mcpPolicies = [
    {
      name: 'AI Model Access Control',
      description: 'Controls access to AI models based on role and trust level',
      policyType: 'ACCESS_CONTROL',
      regoCode: 'package ai.access\n\ndefault allow = false\n\nallow {\n  input.user.trust_level >= 3\n  input.resource.type == "ai_model"\n}',
      isActive: true
    },
    {
      name: 'Data Privacy Compliance',
      description: 'Ensures AI systems comply with data privacy regulations',
      policyType: 'COMPLIANCE',
      regoCode: 'package ai.privacy\n\ndefault allow = false\n\nallow {\n  input.data.encrypted == true\n  input.data.consent_given == true\n}',
      isActive: true
    }
  ];

  for (const policyData of mcpPolicies) {
    await prisma.mcpPolicy.create({
      data: {
        organizationId,
        ...policyData
      }
    });
  }

  console.log(`✅ Created ${mcpPolicies.length} MCP policies`);
}

// =============================================================================
// PHASE 3: Demonstration & Knowledge
// =============================================================================

async function seedSampleRoleAgents(organizationId) {
  console.log('🤖 Seeding sample role agents...');

  const existingCount = await prisma.roleAgent.count({
    where: { organizationId }
  });

  if (existingCount > 0) {
    console.log(`✅ Role agents already exist (${existingCount} found) - skipping`);
    return;
  }

  const roleTemplate = await prisma.roleTemplate.findFirst({
    where: { category: 'Security' }
  });

  if (!roleTemplate) {
    console.log('⚠️ No role template found - skipping sample role agents');
    return;
  }

  const sampleAgents = [
    {
      name: 'L4 Security Engineer',
      description: 'Senior security engineer with advanced threat detection expertise',
      assignedToDid: 'did:ethr:0x1234567890123456789012345678901234567890',
      blockchainAddress: '0x1234567890123456789012345678901234567890',
      blockchainNetwork: 'ethereum',
      trustScore: 850,
      level: 4,
      isEligibleForMint: true,
      status: 'active',
      ansIdentifier: 'l4-security-engineer.securecodecorp.knaight',
      ansRegistrationStatus: 'registered'
    },
    {
      name: 'L3 DevOps Engineer',
      description: 'DevOps engineer focused on secure infrastructure automation',
      assignedToDid: 'did:ethr:0x2345678901234567890123456789012345678901',
      blockchainAddress: '0x2345678901234567890123456789012345678901',
      blockchainNetwork: 'ethereum',
      trustScore: 720,
      level: 3,
      isEligibleForMint: false,
      status: 'active',
      ansIdentifier: 'l3-devops-engineer.securecodecorp.knaight',
      ansRegistrationStatus: 'registered'
    }
  ];

  for (const agentData of sampleAgents) {
    await prisma.roleAgent.create({
      data: {
        organizationId,
        roleTemplateId: roleTemplate.id,
        ...agentData
      }
    });
  }

  console.log(`✅ Created ${sampleAgents.length} sample role agents`);
}

async function seedSampleSignals() {
  console.log('📡 Seeding sample signals...');

  const roleAgents = await prisma.roleAgent.findMany({ take: 2 });
  if (roleAgents.length === 0) {
    console.log('⚠️ No role agents found - skipping sample signals');
    return;
  }

  const sampleSignals = [
    {
      type: 'certification',
      title: 'CISSP Certification',
      description: 'Certified Information Systems Security Professional',
      value: 100,
      source: 'ISC2',
      verified: true,
      metadata: {
        certificationId: 'CISSP-12345',
        issuedDate: new Date('2024-01-15').toISOString(),
        expiresDate: new Date('2027-01-15').toISOString()
      }
    },
    {
      type: 'training',
      title: 'Advanced Threat Detection',
      description: 'Completed advanced threat detection course',
      value: 85,
      source: 'SANS Institute',
      verified: true,
      metadata: {
        courseId: 'FOR508',
        completionDate: new Date('2024-03-20').toISOString(),
        score: 85
      }
    },
    {
      type: 'activity',
      title: 'Security Code Review',
      description: 'Completed 100+ security-focused code reviews',
      value: 90,
      source: 'GitHub',
      verified: true,
      metadata: {
        repository: 'securecodecorp/security-tools',
        reviewCount: 100,
        averageScore: 4.5
      }
    }
  ];

  for (let i = 0; i < sampleSignals.length; i++) {
    const signal = sampleSignals[i];
    await prisma.signal.create({
      data: {
        ...signal,
        roleAgentId: roleAgents[i % roleAgents.length].id
      }
    });
  }

  console.log(`✅ Created ${sampleSignals.length} sample signals`);
}

async function seedSampleCertifications() {
  console.log('🎓 Seeding sample certifications...');

  const roleAgents = await prisma.roleAgent.findMany({ take: 2 });
  if (roleAgents.length === 0) {
    console.log('⚠️ No role agents found - skipping sample certifications');
    return;
  }

  const sampleCertifications = [
    {
      name: 'CISSP',
      issuer: 'ISC2',
      issuedAt: new Date('2024-01-15'),
      expiresAt: new Date('2027-01-15'),
      credentialUrl: 'https://www.isc2.org/verify',
      verified: true,
      verificationMethod: 'ISC2 Verification Portal'
    },
    {
      name: 'AWS Security Specialty',
      issuer: 'Amazon Web Services',
      issuedAt: new Date('2024-02-10'),
      expiresAt: new Date('2027-02-10'),
      credentialUrl: 'https://aws.amazon.com/verification',
      verified: true,
      verificationMethod: 'AWS Credential Verification'
    }
  ];

  for (let i = 0; i < sampleCertifications.length; i++) {
    const cert = sampleCertifications[i];
    await prisma.certification.create({
      data: {
        ...cert,
        roleAgentId: roleAgents[i % roleAgents.length].id
      }
    });
  }

  console.log(`✅ Created ${sampleCertifications.length} sample certifications`);
}

async function seedRagKnowledgeBase() {
  console.log('📚 Seeding RAG Knowledge Base...');

  const existingCount = await prisma.ragKnowledgeBase.count();
  if (existingCount > 0) {
    console.log(`✅ RAG Knowledge Base already exist (${existingCount} found) - skipping`);
    return;
  }

  const sampleDocuments = [
    {
      title: 'Introduction to Cybersecurity',
      content: 'Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These attacks are increasingly sophisticated and can come from various sources, including malicious insiders, cybercriminals, and nation-state actors.',
      source: 'Wikipedia',
      metadata: {
        author: 'Anonymous',
        publishedDate: new Date('2023-01-01').toISOString()
      }
    },
    {
      title: 'Common Cybersecurity Threats',
      content: 'Some common cybersecurity threats include phishing attacks, malware infections, denial-of-service (DoS) attacks, and man-in-the-middle (MiTM) attacks. These threats can be mitigated through various security measures and best practices.',
      source: 'Cisco',
      metadata: {
        author: 'Cisco Systems',
        publishedDate: new Date('2023-02-15').toISOString()
      }
    },
    {
      title: 'Secure Coding Practices',
      content: 'Secure coding practices are essential for developing software that is resistant to attacks. This includes following secure coding guidelines, using secure libraries, and regularly auditing code for vulnerabilities.',
      source: 'OWASP',
      metadata: {
        author: 'OWASP Foundation',
        publishedDate: new Date('2023-03-20').toISOString()
      }
    }
  ];

  for (const document of sampleDocuments) {
    await prisma.ragKnowledgeBase.create({
      data: {
        title: document.title,
        content: document.content,
        source: document.source,
        metadata: document.metadata
      }
    });
  }

  console.log(`✅ Created ${sampleDocuments.length} RAG Knowledge Base documents`);
}

// =============================================================================
// Fallback Seeding
// =============================================================================

async function fallbackSeeding() {
  console.log('🔄 Running fallback seeding...');

  try {
    // Create minimal organization
    const organization = await prisma.organization.upsert({
      where: { domain: 'fallback.local' },
      update: {},
      create: {
        id: 'org-fallback',
        name: 'Fallback Organization',
        description: 'Fallback organization for emergency seeding',
        domain: 'fallback.local',
        isActive: true,
        onboardingComplete: false
      }
    });

    // Create minimal role template
    await prisma.roleTemplate.upsert({
      where: { id: 'role-fallback' },
      update: {},
      create: {
        id: 'role-fallback',
        title: 'Fallback Role',
        focus: 'Basic functionality',
        category: 'System',
        selectable: false,
        responsibilities: ['Basic operations'],
        securityContributions: [{ title: 'Basic Security', bullets: ['Standard practices'] }]
      }
    });

    console.log('✅ Fallback seeding completed with minimal data');

  } catch (error) {
    console.error('❌ Fallback seeding failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  deploySeed();
}

module.exports = { deploySeed };
