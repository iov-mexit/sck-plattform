#!/usr/bin/env node

/**
 * SCK Platform Comprehensive Seeding Strategy
 * Executes all seeding phases in the correct order with organizational extensions
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configuration
const SEED_CONFIG = {
  SEED_EXTENDED_ORGS: process.env.SEED_EXTENDED_ORGS === 'true',
  SEED_DEMO_DATA: process.env.SEED_DEMO_DATA === 'true',
  SEED_AI_FEATURES: process.env.SEED_AI_FEATURES === 'true'
};

async function fullSeed() {
  console.log('🌱 Starting SCK Platform Comprehensive Seeding Strategy');
  console.log('========================================================');
  console.log(`📊 Configuration:`);
  console.log(`   - Extended Organizations: ${SEED_CONFIG.SEED_EXTENDED_ORGS}`);
  console.log(`   - Demo Data: ${SEED_CONFIG.SEED_DEMO_DATA}`);
  console.log(`   - AI Features: ${SEED_CONFIG.SEED_AI_FEATURES}`);
  console.log('');

  try {
    // Phase 1: Foundation (Critical)
    console.log('📋 PHASE 1: Foundation (Critical)');
    console.log('==================================');

    const defaultOrg = await seedDefaultOrganization();
    await seedRoleTemplates(defaultOrg.id);
    await seedBasicTrustThresholds(defaultOrg.id);
    await seedLoAPolicies(defaultOrg.id);

    // Phase 1.5: Organizational Extensions (Future-Proofing)
    if (SEED_CONFIG.SEED_EXTENDED_ORGS) {
      console.log('\n📋 PHASE 1.5: Organizational Extensions');
      console.log('==========================================');
      await seedExtendedOrganizations();
    }

    // Phase 2: Governance & Compliance (Important)
    console.log('\n📋 PHASE 2: Governance & Compliance');
    console.log('====================================');

    await seedComprehensiveTrustThresholds(defaultOrg.id);
    await seedMcpPolicies(defaultOrg.id);

    // Phase 3: Demonstration & Knowledge (Enhancement)
    if (SEED_CONFIG.SEED_DEMO_DATA) {
      console.log('\n📋 PHASE 3: Demonstration & Knowledge');
      console.log('=======================================');

      await seedSampleRoleAgents(defaultOrg.id);
      await seedSampleSignals();
      await seedSampleCertifications();
    }

    // Phase 4: AI & RAG Features (Advanced)
    if (SEED_CONFIG.SEED_AI_FEATURES) {
      console.log('\n📋 PHASE 4: AI & RAG Features');
      console.log('================================');

      await seedRagKnowledgeBase();
      await seedAiPolicies(defaultOrg.id);
    }

    console.log('\n🎉 SCK Platform comprehensive seeding completed successfully!');
    console.log('✅ All configured phases completed and ready for production use');

    // Final status report
    await generateSeedingReport();

  } catch (error) {
    console.error('❌ Comprehensive seeding failed:', error instanceof Error ? error.message : String(error));
    console.log('🔄 Attempting fallback seeding...');

    try {
      await fallbackSeeding();
      console.log('✅ Fallback seeding completed');
    } catch (fallbackError) {
      console.error('❌ Fallback seeding also failed:', fallbackError instanceof Error ? fallbackError.message : String(fallbackError));
      process.exit(1);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// =============================================================================
// PHASE 1: Foundation (Critical)
// =============================================================================

async function seedDefaultOrganization() {
  console.log('🏢 Seeding default organization...');

  const defaultOrg = await prisma.organization.upsert({
    where: { domain: 'default.org' },
    update: {},
    create: {
      id: 'org-default-system',
      name: 'Default Organization',
      description: 'System default organization for SCK Platform bootstrap',
      domain: 'default.org',
      isActive: true,
      onboardingComplete: true,
      complianceTags: ['SYSTEM', 'DEFAULT', 'BOOTSTRAP'],
      metadata: {
        system: true,
        seedVersion: '1.0.0',
        createdAt: new Date().toISOString()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  console.log(`✅ Default organization: ${defaultOrg.name} (${defaultOrg.domain})`);

  // Create default admin user
  const defaultAdmin = await prisma.organizationMember.upsert({
    where: {
      organizationId_email: {
        organizationId: defaultOrg.id,
        email: 'admin@default.org'
      }
    },
    update: {},
    create: {
      id: 'member-default-admin',
      organizationId: defaultOrg.id,
      name: 'Default Admin',
      email: 'admin@default.org',
      role: 'ADMIN',
      isActive: true
    }
  });

  console.log(`✅ Default admin user: ${defaultAdmin.name} (${defaultAdmin.email})`);

  return defaultOrg;
}

async function seedExtendedOrganizations() {
  console.log('🏢 Seeding extended organizations...');

  const extendedOrgs = [
    {
      name: 'Acme Security Corp',
      domain: 'acme-security.com',
      description: 'Leading cybersecurity consulting firm',
      complianceTags: ['SOC2', 'ISO27001', 'GDPR', 'EU_AI_ACT'],
      metadata: { type: 'demo', industry: 'cybersecurity' }
    },
    {
      name: 'DevOps Labs Inc',
      domain: 'devopslabs.io',
      description: 'DevOps and infrastructure automation specialists',
      complianceTags: ['ISO27001', 'NIST', 'OWASP'],
      metadata: { type: 'demo', industry: 'devops' }
    },
    {
      name: 'AI Governance Partners',
      domain: 'aigovernance.partners',
      description: 'AI compliance and governance consulting',
      complianceTags: ['EU_AI_ACT', 'GDPR', 'AI_ETHICS'],
      metadata: { type: 'demo', industry: 'ai_governance' }
    }
  ];

  for (const orgData of extendedOrgs) {
    const org = await prisma.organization.upsert({
      where: { domain: orgData.domain },
      update: {},
      create: {
        id: `org-${orgData.domain.replace(/[^a-zA-Z0-9]/g, '-')}`,
        name: orgData.name,
        description: orgData.description,
        domain: orgData.domain,
        isActive: true,
        onboardingComplete: true,
        complianceTags: orgData.complianceTags,
        metadata: orgData.metadata,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log(`✅ Extended organization: ${org.name} (${org.domain})`);

    // Create org admin for each extended organization
    const adminEmail = `admin@${orgData.domain}`;
    await prisma.organizationMember.upsert({
      where: {
        organizationId_email: {
          organizationId: org.id,
          email: adminEmail
        }
      },
      update: {},
      create: {
        id: `member-${org.id}-admin`,
        organizationId: org.id,
        name: `${orgData.name} Admin`,
        email: adminEmail,
        role: 'ADMIN',
        isActive: true
      }
    });
  }

  console.log(`✅ Created ${extendedOrgs.length} extended organizations with admins`);
}

async function seedRoleTemplates(organizationId: string) {
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
    console.error('❌ Comprehensive seed failed:', seedError instanceof Error ? seedError.message : String(seedError));
    console.log('🔄 Creating basic role templates as fallback...');
    await createBasicRoleTemplates(organizationId);
  }
}

async function createBasicRoleTemplates(organizationId: string) {
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
      organizationId,
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
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  for (const template of basicTemplates) {
    await prisma.roleTemplate.create({ data: template });
  }

  console.log(`✅ Created ${basicTemplates.length} basic role templates`);
}

async function seedBasicTrustThresholds(organizationId: string) {
  console.log('🎯 Seeding basic trust thresholds...');

  const existingCount = await prisma.roleTrustThreshold.count({
    where: { organizationId }
  });

  if (existingCount > 0) {
    console.log(`✅ Trust thresholds already exist (${existingCount} found) - skipping`);
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
          organizationId,
          roleTitle: threshold.roleTitle
        }
      },
      update: { minTrustScore: threshold.minTrustScore },
      create: {
        organizationId,
        roleTitle: threshold.roleTitle,
        minTrustScore: threshold.minTrustScore,
        isActive: true
      }
    });
  }

  console.log(`✅ Created ${basicThresholds.length} basic trust thresholds`);
}

async function seedLoAPolicies(organizationId: string) {
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

async function seedComprehensiveTrustThresholds(organizationId: string) {
  console.log('🎯 Seeding comprehensive trust thresholds...');

  try {
    const { execSync } = require('child_process');
    execSync('npx tsx seed-comprehensive-trust-thresholds.ts', {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log('✅ Comprehensive trust thresholds seeded successfully');
  } catch (seedError) {
    console.error('❌ Comprehensive trust thresholds failed:', seedError instanceof Error ? seedError.message : String(seedError));
    console.log('🔄 Skipping comprehensive thresholds - basic ones already created');
  }
}

async function seedMcpPolicies(organizationId: string) {
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

async function seedSampleRoleAgents(organizationId: string) {
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
      ansIdentifier: 'l4-security-engineer.default.knaight',
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
      ansIdentifier: 'l3-devops-engineer.default.knaight',
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
        repository: 'default/security-tools',
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

// =============================================================================
// PHASE 4: AI & RAG Features
// =============================================================================

async function seedRagKnowledgeBase() {
  console.log('📚 Seeding RAG Knowledge Base...');

  try {
    const existingCount = await prisma.$queryRaw`SELECT COUNT(*) FROM rag_knowledge_base`;
    if (existingCount > 0) {
      console.log(`✅ RAG Knowledge Base already exists - skipping`);
      return;
    }
  } catch (ragError) {
    console.log('⚠️ RAG Knowledge Base table not found - skipping');
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
    await prisma.$executeRaw`
      INSERT INTO rag_knowledge_base (title, content, source, metadata)
      VALUES (${document.title}, ${document.content}, ${document.source}, ${JSON.stringify(document.metadata)})
    `;
  }

  console.log(`✅ Created ${sampleDocuments.length} RAG Knowledge Base documents`);
}

async function seedAiPolicies(organizationId: string) {
  console.log('🤖 Seeding AI policies...');

  const existingCount = await prisma.mcpPolicy.count({
    where: {
      organizationId,
      name: { contains: 'AI' }
    }
  });

  if (existingCount > 0) {
    console.log(`✅ AI policies already exist (${existingCount} found) - skipping`);
    return;
  }

  const aiPolicies = [
    {
      name: 'AI Model Risk Assessment',
      description: 'Comprehensive risk assessment for AI model deployment',
      policyType: 'RISK_ASSESSMENT',
      regoCode: 'package ai.risk\n\ndefault allow = false\n\nallow {\n  input.model.risk_level == "low"\n  input.user.trust_level >= 4\n}',
      isActive: true
    },
    {
      name: 'AI Data Privacy Guardrails',
      description: 'Ensures AI systems respect data privacy boundaries',
      policyType: 'PRIVACY',
      regoCode: 'package ai.privacy\n\ndefault allow = false\n\nallow {\n  input.data.pii_handling == "encrypted"\n  input.data.consent_verified == true\n}',
      isActive: true
    }
  ];

  for (const policyData of aiPolicies) {
    await prisma.mcpPolicy.create({
      data: {
        organizationId,
        ...policyData
      }
    });
  }

  console.log(`✅ Created ${aiPolicies.length} AI policies`);
}

// =============================================================================
// Fallback & Reporting
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
    console.error('❌ Fallback seeding failed:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

async function generateSeedingReport() {
  console.log('\n📊 Seeding Report');
  console.log('==================');

  try {
    const orgs = await prisma.organization.count();
    const templates = await prisma.roleTemplate.count();
    const thresholds = await prisma.roleTrustThreshold.count();
    const policies = await prisma.loaPolicy.count();
    const mcpPolicies = await prisma.mcpPolicy.count();
    const agents = await prisma.roleAgent.count();
    const signals = await prisma.signal.count();
    const certs = await prisma.certification.count();

    console.log(`🏢 Organizations: ${orgs}`);
    console.log(`👥 Role Templates: ${templates}`);
    console.log(`🎯 Trust Thresholds: ${thresholds}`);
    console.log(`📋 LoA Policies: ${policies}`);
    console.log(`🤖 MCP Policies: ${mcpPolicies}`);
    console.log(`🤖 Role Agents: ${agents}`);
    console.log(`📡 Signals: ${signals}`);
    console.log(`🎓 Certifications: ${certs}`);

    const total = orgs + templates + thresholds + policies + mcpPolicies + agents + signals + certs;
    console.log(`\n📈 Total seeded entities: ${total}`);

    if (total > 0) {
      console.log('✅ Platform is ready for production use!');
    } else {
      console.log('⚠️ No data was seeded - platform may not function properly');
    }

  } catch (error) {
    console.log('⚠️ Could not generate seeding report:', error instanceof Error ? error.message : String(error));
  }
}

// Run if called directly
if (require.main === module) {
  fullSeed();
}

module.exports = { fullSeed };
