#!/usr/bin/env node

/**
 * SCK Platform Enterprise Seeding Strategy (Simplified)
 * Creates realistic organizational structure with existing schema
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function enterpriseSimpleSeed() {
  console.log('🏢 Starting SCK Platform Enterprise Seeding Strategy (Simplified)');
  console.log('==================================================================');

  try {
    // Phase 1: Create Enterprise Organization
    console.log('\n📋 PHASE 1: Enterprise Organization');
    console.log('=====================================');

    const enterpriseOrg = await createEnterpriseOrganization();

    // Phase 2: Create Comprehensive Role Templates
    console.log('\n📋 PHASE 2: Comprehensive Role Templates');
    console.log('==========================================');

    const roleTemplates = await createComprehensiveRoleTemplates(enterpriseOrg.id);

    // Phase 3: Create Multi-Assignable Role Agents
    console.log('\n📋 PHASE 3: Multi-Assignable Role Agents');
    console.log('==========================================');

    const roleAgents = await createMultiAssignableRoleAgents(enterpriseOrg.id, roleTemplates);

    // Phase 4: Create Certifications & Skills
    console.log('\n📋 PHASE 4: Certifications & Skills');
    console.log('=====================================');

    await createCertificationsAndSkills(roleAgents);

    // Phase 5: Create Trust Thresholds & Policies
    console.log('\n📋 PHASE 5: Trust Thresholds & Policies');
    console.log('=========================================');

    await createTrustThresholdsAndPolicies(enterpriseOrg.id, roleTemplates);

    console.log('\n🎉 Enterprise seeding completed successfully!');
    await generateEnterpriseReport();

  } catch (error) {
    console.error('❌ Enterprise seeding failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// =============================================================================
// PHASE 1: Enterprise Organization
// =============================================================================

async function createEnterpriseOrganization() {
  console.log('🏢 Creating enterprise organization...');

  const enterpriseOrg = await prisma.organization.upsert({
    where: { domain: 'enterprise-demo.com' },
    update: {},
    create: {
      id: 'org-enterprise-demo',
      name: 'Enterprise Demo Corporation',
      description: 'Comprehensive enterprise organization for testing cross-team collaboration and multi-assignable roles',
      domain: 'enterprise-demo.com',
      isActive: true,
      onboardingComplete: true,
      complianceTags: ['SOC2', 'ISO27001', 'GDPR', 'EU_AI_ACT', 'NIST', 'OWASP'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  console.log(`✅ Enterprise organization: ${enterpriseOrg.name} (${enterpriseOrg.domain})`);

  // Create enterprise admin
  const existingAdmin = await prisma.organizationMember.findFirst({
    where: {
      organizationId: enterpriseOrg.id,
      email: 'admin@enterprise-demo.com'
    }
  });
  
  if (!existingAdmin) {
    await prisma.organizationMember.create({
      data: {
        id: 'member-enterprise-admin',
        organizationId: enterpriseOrg.id,
        name: 'Enterprise Admin',
        email: 'admin@enterprise-demo.com',
        role: 'ADMIN',
        isActive: true
      }
    });
    console.log('✅ Created enterprise admin member');
  } else {
    console.log('✅ Enterprise admin member already exists');
  }

  return enterpriseOrg;
}

// =============================================================================
// PHASE 2: Comprehensive Role Templates
// =============================================================================

async function createComprehensiveRoleTemplates(organizationId) {
  console.log('👥 Creating comprehensive role templates...');

  const roleTemplates = [
    // Engineering Roles
    {
      id: 'role-senior-frontend-engineer',
      title: 'Senior Frontend Engineer',
      focus: 'Frontend Development & Security',
      category: 'Engineering',
      selectable: true,
      responsibilities: [
        'Lead frontend architecture decisions',
        'Implement security best practices',
        'Mentor junior developers',
        'Cross-team collaboration on security features'
      ],
      securityContributions: [
        {
          title: 'Frontend Security',
          bullets: [
            'OWASP Top 10 implementation',
            'Content Security Policy',
            'XSS prevention',
            'Accessibility compliance'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-security-engineer',
      title: 'Security Engineer',
      focus: 'Application Security & DevSecOps',
      category: 'Security',
      selectable: true,
      responsibilities: [
        'Security code reviews',
        'DevSecOps implementation',
        'Security tooling development',
        'Cross-team security training'
      ],
      securityContributions: [
        {
          title: 'Application Security',
          bullets: [
            'SAST/DAST integration',
            'Security testing automation',
            'Vulnerability assessment',
            'Security training delivery'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-compliance-specialist',
      title: 'Compliance Specialist',
      focus: 'Regulatory Compliance & Automation',
      category: 'Compliance',
      selectable: true,
      responsibilities: [
        'Compliance framework implementation',
        'Automation of compliance processes',
        'Cross-departmental compliance coordination',
        'Regulatory reporting'
      ],
      securityContributions: [
        {
          title: 'Compliance Automation',
          bullets: [
            'SOC2 automation',
            'GDPR compliance tools',
            'EU AI Act implementation',
            'Compliance monitoring'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-devops-engineer',
      title: 'DevOps Engineer',
      focus: 'Infrastructure & Security Automation',
      category: 'Operations',
      selectable: true,
      responsibilities: [
        'CI/CD pipeline security',
        'Infrastructure as Code',
        'Security monitoring implementation',
        'Cross-team deployment support'
      ],
      securityContributions: [
        {
          title: 'Infrastructure Security',
          bullets: [
            'Secure CI/CD practices',
            'Infrastructure security scanning',
            'Monitoring and alerting',
            'Disaster recovery'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-threat-analyst',
      title: 'Threat Intelligence Analyst',
      focus: 'Threat Detection & Response',
      category: 'Security',
      selectable: true,
      responsibilities: [
        'Threat intelligence gathering',
        'Incident response coordination',
        'Cross-team threat briefings',
        'Security awareness training'
      ],
      securityContributions: [
        {
          title: 'Threat Intelligence',
          bullets: [
            'Threat hunting',
            'Incident analysis',
            'Intelligence sharing',
            'Response coordination'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-backend-engineer',
      title: 'Backend Engineer',
      focus: 'Server-side Development & API Security',
      category: 'Engineering',
      selectable: true,
      responsibilities: [
        'API design and implementation',
        'Database security and optimization',
        'Backend security hardening',
        'Performance monitoring'
      ],
      securityContributions: [
        {
          title: 'Backend Security',
          bullets: [
            'API security implementation',
            'SQL injection prevention',
            'Authentication & authorization',
            'Data encryption'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-data-engineer',
      title: 'Data Engineer',
      focus: 'Data Pipeline Security & Privacy',
      category: 'Engineering',
      selectable: true,
      responsibilities: [
        'Data pipeline development',
        'Privacy compliance implementation',
        'Data security controls',
        'GDPR compliance automation'
      ],
      securityContributions: [
        {
          title: 'Data Security',
          bullets: [
            'Data encryption at rest/transit',
            'PII detection and handling',
            'Data access controls',
            'Privacy by design'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-ai-governance-specialist',
      title: 'AI Governance Specialist',
      focus: 'AI Ethics & Compliance',
      category: 'Compliance',
      selectable: true,
      responsibilities: [
        'AI governance framework development',
        'EU AI Act compliance',
        'AI ethics guidelines',
        'AI risk assessment'
      ],
      securityContributions: [
        {
          title: 'AI Governance',
          bullets: [
            'AI risk assessment',
            'Bias detection and mitigation',
            'Transparency requirements',
            'Human oversight controls'
          ]
        }
      ],
      organizationId
    }
  ];

  const createdTemplates = [];
  for (const templateData of roleTemplates) {
    const createdTemplate = await prisma.roleTemplate.upsert({
      where: { id: templateData.id },
      update: {},
      create: templateData
    });
    
    console.log(`✅ Created/Updated role template: ${createdTemplate.title}`);
    createdTemplates.push(createdTemplate);
  }

  return roleTemplates;
}

// =============================================================================
// PHASE 3: Multi-Assignable Role Agents
// =============================================================================

async function createMultiAssignableRoleAgents(organizationId, roleTemplates, teams) {
  console.log('🤖 Creating multi-assignable role agents...');

  const roleAgents = [
    {
      name: 'L4 Senior Frontend Engineer - Sarah Chen',
      description: 'Senior frontend engineer with security focus, working across multiple projects',
      assignedToDid: 'did:ethr:0x1234567890123456789012345678901234567890',
      blockchainAddress: '0x1234567890123456789012345678901234567890',
      blockchainNetwork: 'ethereum',
      trustScore: 850,
      level: 4,
      loaLevel: 'L4',
      isEligibleForMint: true,
      status: 'active',
      ansIdentifier: 'l4-senior-frontend-engineer.enterprise-demo.knaight',
      ansRegistrationStatus: 'registered',
      roleTemplateId: 'role-senior-frontend-engineer',
      organizationId
    },
    {
      name: 'L5 Security Engineer - Marcus Rodriguez',
      description: 'Lead security engineer working across multiple teams and projects',
      assignedToDid: 'did:ethr:0x2345678901234567890123456789012345678901',
      blockchainAddress: '0x2345678901234567890123456789012345678901',
      blockchainNetwork: 'ethereum',
      trustScore: 920,
      level: 5,
      loaLevel: 'L5',
      isEligibleForMint: true,
      status: 'active',
      ansIdentifier: 'l5-security-engineer.enterprise-demo.knaight',
      ansRegistrationStatus: 'registered',
      roleTemplateId: 'role-security-engineer',
      organizationId
    },
    {
      name: 'L4 Compliance Specialist - Dr. Emily Watson',
      description: 'Compliance expert leading AI governance and automation initiatives',
      assignedToDid: 'did:ethr:0x3456789012345678901234567890123456789012',
      blockchainAddress: '0x3456789012345678901234567890123456789012',
      blockchainNetwork: 'ethereum',
      trustScore: 880,
      level: 4,
      loaLevel: 'L4',
      isEligibleForMint: true,
      status: 'active',
      ansIdentifier: 'l4-compliance-specialist.enterprise-demo.knaight',
      ansRegistrationStatus: 'registered',
      roleTemplateId: 'role-compliance-specialist',
      organizationId
    },
    {
      name: 'L3 DevOps Engineer - Alex Kim',
      description: 'DevOps engineer supporting security and incident response teams',
      assignedToDid: 'did:ethr:0x4567890123456789012345678901234567890123',
      blockchainAddress: '0x4567890123456789012345678901234567890123',
      blockchainNetwork: 'ethereum',
      trustScore: 720,
      level: 3,
      loaLevel: 'L3',
      isEligibleForMint: false,
      status: 'active',
      ansIdentifier: 'l3-devops-engineer.enterprise-demo.knaight',
      ansRegistrationStatus: 'registered',
      roleTemplateId: 'role-devops-engineer',
      organizationId
    },
    {
      name: 'L4 Threat Analyst - David Park',
      description: 'Threat intelligence analyst coordinating incident response across teams',
      assignedToDid: 'did:ethr:0x5678901234567890123456789012345678901234',
      blockchainAddress: '0x5678901234567890123456789012345678901234',
      blockchainNetwork: 'ethereum',
      trustScore: 820,
      level: 4,
      loaLevel: 'L4',
      isEligibleForMint: true,
      status: 'active',
      ansIdentifier: 'l4-threat-analyst.enterprise-demo.knaight',
      ansRegistrationStatus: 'registered',
      roleTemplateId: 'role-threat-analyst',
      organizationId
    }
  ];

  const createdAgents = [];
  for (const agentData of roleAgents) {
    const createdAgent = await prisma.roleAgent.create({
      data: agentData
    });
    
    console.log(`✅ Created role agent: ${createdAgent.name}`);
    createdAgents.push(createdAgent);
  }
  
  return createdAgents;
}

// =============================================================================
// PHASE 4: Certifications & Skills
// =============================================================================

async function createCertificationsAndSkills(roleAgents) {
  console.log('🎓 Creating certifications and skills...');
  
  // Get the first 5 role agents for certifications
  const agentsForCerts = roleAgents.slice(0, 5);
  
  const certifications = [
    {
      name: 'CISSP',
      issuer: 'ISC2',
      issuedAt: new Date('2023-01-15'),
      expiresAt: new Date('2026-01-15'),
      credentialUrl: 'https://www.isc2.org/verify',
      verified: true,
      verificationMethod: 'ISC2 Verification Portal',
      roleAgentId: agentsForCerts[0].id
    },
    {
      name: 'AWS Security Specialty',
      issuer: 'Amazon Web Services',
      issuedAt: new Date('2023-03-20'),
      expiresAt: new Date('2026-03-20'),
      credentialUrl: 'https://aws.amazon.com/verification',
      verified: true,
      verificationMethod: 'AWS Credential Verification',
      roleAgentId: agentsForCerts[1].id
    },
    {
      name: 'Certified Information Systems Auditor (CISA)',
      issuer: 'ISACA',
      issuedAt: new Date('2022-11-10'),
      expiresAt: new Date('2025-11-10'),
      credentialUrl: 'https://www.isaca.org/verify',
      verified: true,
      verificationMethod: 'ISACA Verification Portal',
      roleAgentId: agentsForCerts[2].id
    },
    {
      name: 'Google Cloud Professional Cloud Security Engineer',
      issuer: 'Google Cloud',
      issuedAt: new Date('2023-06-15'),
      expiresAt: new Date('2026-06-15'),
      credentialUrl: 'https://cloud.google.com/certification',
      verified: true,
      verificationMethod: 'Google Cloud Verification',
      roleAgentId: agentsForCerts[3].id
    },
    {
      name: 'SANS GIAC Certified Incident Handler (GCIH)',
      issuer: 'SANS Institute',
      issuedAt: new Date('2023-09-20'),
      expiresAt: new Date('2026-09-20'),
      credentialUrl: 'https://www.sans.org/verify',
      verified: true,
      verificationMethod: 'SANS Verification Portal',
      roleAgentId: agentsForCerts[4].id
    }
  ];
  
  for (const certData of certifications) {
    await prisma.certification.create({
      data: certData
    });
    
    console.log(`✅ Created certification: ${certData.name}`);
  }
}

// =============================================================================
// PHASE 5: Trust Thresholds & Policies
// =============================================================================

async function createTrustThresholdsAndPolicies(organizationId, roleTemplates) {
  console.log('🎯 Creating trust thresholds and policies...');

  // Create trust thresholds for each role
  const trustThresholds = [
    { roleTitle: 'Senior Frontend Engineer', minTrustScore: 800 },
    { roleTitle: 'Security Engineer', minTrustScore: 850 },
    { roleTitle: 'Compliance Specialist', minTrustScore: 800 },
    { roleTitle: 'DevOps Engineer', minTrustScore: 750 },
    { roleTitle: 'Threat Intelligence Analyst', minTrustScore: 800 },
    { roleTitle: 'Backend Engineer', minTrustScore: 750 },
    { roleTitle: 'Data Engineer', minTrustScore: 800 },
    { roleTitle: 'AI Governance Specialist', minTrustScore: 850 }
  ];

  for (const threshold of trustThresholds) {
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

  console.log(`✅ Created ${trustThresholds.length} trust thresholds`);

  // Create LoA policies
  const loaPolicies = [
    {
      artifactType: 'RoleAgent',
      level: 'L1',
      minReviewers: 1,
      requiredFacets: ['security'],
      externalRequired: false,
      description: 'Basic role agent creation - single security review'
    },
    {
      artifactType: 'RoleAgent',
      level: 'L2',
      minReviewers: 2,
      requiredFacets: ['security', 'compliance'],
      externalRequired: false,
      description: 'Standard role agent - security and compliance review'
    },
    {
      artifactType: 'RoleAgent',
      level: 'L3',
      minReviewers: 3,
      requiredFacets: ['security', 'compliance', 'policy'],
      externalRequired: false,
      description: 'Advanced role agent - comprehensive review'
    },
    {
      artifactType: 'RoleAgent',
      level: 'L4',
      minReviewers: 4,
      requiredFacets: ['security', 'compliance', 'policy', 'technical'],
      externalRequired: false,
      description: 'Senior role agent - comprehensive technical review'
    },
    {
      artifactType: 'RoleAgent',
      level: 'L5',
      minReviewers: 5,
      requiredFacets: ['security', 'compliance', 'policy', 'technical', 'business'],
      externalRequired: true,
      description: 'Lead role agent - comprehensive review with external validation'
    }
  ];

  for (const policyData of loaPolicies) {
    await prisma.loaPolicy.create({
      data: {
        organizationId,
        ...policyData,
        isActive: true
      }
    });
  }

  console.log(`✅ Created ${loaPolicies.length} LoA policies`);
}

// =============================================================================
// Reporting
// =============================================================================

async function generateEnterpriseReport() {
  console.log('\n📊 Enterprise Seeding Report');
  console.log('=============================');

  try {
    const orgs = await prisma.organization.count();
    const templates = await prisma.roleTemplate.count();
    const agents = await prisma.roleAgent.count();
    const certs = await prisma.certification.count();
    const thresholds = await prisma.roleTrustThreshold.count();
    const policies = await prisma.loaPolicy.count();

    console.log(`🏢 Organizations: ${orgs}`);
    console.log(`👤 Role Templates: ${templates}`);
    console.log(`🤖 Role Agents: ${agents}`);
    console.log(`🎓 Certifications: ${certs}`);
    console.log(`🎯 Trust Thresholds: ${thresholds}`);
    console.log(`📋 LoA Policies: ${policies}`);
    
    const total = orgs + templates + agents + certs + thresholds + policies;
    console.log(`\n📈 Total seeded entities: ${total}`);
    console.log('✅ Enterprise platform is ready for comprehensive testing!');
    
  } catch (error) {
    console.log('⚠️ Could not generate enterprise report:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  enterpriseSimpleSeed();
}

module.exports = { enterpriseSimpleSeed };