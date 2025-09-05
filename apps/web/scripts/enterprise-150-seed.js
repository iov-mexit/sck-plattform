#!/usr/bin/env node

/**
 * SCK Platform Enterprise Seeding Strategy (150+ SDLC Resources)
 * Creates realistic enterprise organization with comprehensive role structure
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function enterprise150Seed() {
  console.log('🏢 Starting SCK Platform Enterprise Seeding Strategy (150+ SDLC Resources)');
  console.log('============================================================================');

  try {
    // Phase 1: Create Enterprise Organization
    console.log('\n📋 PHASE 1: Enterprise Organization');
    console.log('=====================================');

    const enterpriseOrg = await createEnterpriseOrganization();

    // Phase 2: Create Comprehensive Role Templates (Reusable Job Descriptions)
    console.log('\n📋 PHASE 2: Comprehensive Role Templates');
    console.log('==========================================');

    const roleTemplates = await createComprehensiveRoleTemplates(enterpriseOrg.id);

    // Phase 3: Create Role Agents (Unique Individuals)
    console.log('\n📋 PHASE 3: Role Agents (Unique Individuals)');
    console.log('==============================================');

    const roleAgents = await createRoleAgents(enterpriseOrg.id, roleTemplates);

    // Phase 4: Create Certifications & Skills
    console.log('\n📋 PHASE 4: Certifications & Skills');
    console.log('=====================================');

    await createCertificationsAndSkills(roleAgents);

    // Phase 5: Create Trust Thresholds & Policies
    console.log('\n📋 PHASE 5: Trust Thresholds & Policies');
    console.log('=========================================');

    await createTrustThresholdsAndPolicies(enterpriseOrg.id, roleTemplates);

    // Phase 6: Create Sample Team Compositions
    console.log('\n📋 PHASE 6: Sample Team Compositions');
    console.log('=====================================');

    await createSampleTeamCompositions(enterpriseOrg.id, roleAgents);

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
    where: { domain: 'enterprise-150.com' },
    update: {},
    create: {
      id: 'org-enterprise-150',
      name: 'Enterprise 150+ SDLC Corporation',
      description: 'Large enterprise organization with 150+ SDLC-focused resources across multiple teams and projects',
      domain: 'enterprise-150.com',
      isActive: true,
      onboardingComplete: true,
      complianceTags: ['SOC2', 'ISO27001', 'GDPR', 'EU_AI_ACT', 'NIST', 'OWASP', 'CIS', 'PCI_DSS'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  console.log(`✅ Enterprise organization: ${enterpriseOrg.name} (${enterpriseOrg.domain})`);

  // Create enterprise admin
  await prisma.organizationMember.upsert({
    where: { id: 'member-enterprise-admin' },
    update: {},
    create: {
      id: 'member-enterprise-admin',
      organizationId: enterpriseOrg.id,
      name: 'Enterprise Admin',
      email: 'admin@enterprise-150.com',
      role: 'ADMIN',
      isActive: true
    }
  });
  console.log('✅ Enterprise admin member ready');

  return enterpriseOrg;
}

// =============================================================================
// PHASE 2: Comprehensive Role Templates (Reusable Job Descriptions)
// =============================================================================

async function createComprehensiveRoleTemplates(organizationId) {
  console.log('👥 Creating comprehensive role templates...');

  const roleTemplates = [
    // ===== FRONTEND ENGINEERING =====
    {
      id: 'role-frontend-engineer-junior',
      title: 'Frontend Engineer (Junior)',
      focus: 'Frontend Development & Basic Security',
      category: 'Frontend Engineering',
      selectable: true,
      responsibilities: [
        'Implement UI components',
        'Basic security practices',
        'Code review participation',
        'Testing and debugging'
      ],
      securityContributions: [
        {
          title: 'Basic Frontend Security',
          bullets: [
            'OWASP Top 10 awareness',
            'Input validation',
            'XSS prevention basics',
            'Accessibility compliance'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-frontend-engineer-mid',
      title: 'Frontend Engineer (Mid-Level)',
      focus: 'Frontend Architecture & Security Implementation',
      category: 'Frontend Engineering',
      selectable: true,
      responsibilities: [
        'Component architecture design',
        'Security implementation',
        'Performance optimization',
        'Mentoring junior developers'
      ],
      securityContributions: [
        {
          title: 'Frontend Security Implementation',
          bullets: [
            'OWASP Top 10 implementation',
            'Content Security Policy',
            'XSS prevention',
            'CSRF protection'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-frontend-engineer-senior',
      title: 'Frontend Engineer (Senior)',
      focus: 'Frontend Leadership & Security Architecture',
      category: 'Frontend Engineering',
      selectable: true,
      responsibilities: [
        'Frontend architecture decisions',
        'Security strategy',
        'Team leadership',
        'Cross-team collaboration'
      ],
      securityContributions: [
        {
          title: 'Frontend Security Architecture',
          bullets: [
            'Security by design',
            'Advanced OWASP implementation',
            'Security tooling integration',
            'Security training delivery'
          ]
        }
      ],
      organizationId
    },

    // ===== BACKEND ENGINEERING =====
    {
      id: 'role-backend-engineer-junior',
      title: 'Backend Engineer (Junior)',
      focus: 'Backend Development & Basic Security',
      category: 'Backend Engineering',
      selectable: true,
      responsibilities: [
        'API implementation',
        'Database operations',
        'Basic security practices',
        'Testing and debugging'
      ],
      securityContributions: [
        {
          title: 'Basic Backend Security',
          bullets: [
            'SQL injection prevention',
            'Input validation',
            'Authentication basics',
            'Error handling'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-backend-engineer-mid',
      title: 'Backend Engineer (Mid-Level)',
      focus: 'Backend Architecture & Security',
      category: 'Backend Engineering',
      selectable: true,
      responsibilities: [
        'API design and architecture',
        'Security implementation',
        'Performance optimization',
        'Database design'
      ],
      securityContributions: [
        {
          title: 'Backend Security Implementation',
          bullets: [
            'API security',
            'Advanced authentication',
            'Data encryption',
            'Rate limiting'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-backend-engineer-senior',
      title: 'Backend Engineer (Senior)',
      focus: 'Backend Leadership & Security Architecture',
      category: 'Backend Engineering',
      selectable: true,
      responsibilities: [
        'System architecture decisions',
        'Security strategy',
        'Team leadership',
        'Cross-team collaboration'
      ],
      securityContributions: [
        {
          title: 'Backend Security Architecture',
          bullets: [
            'Security by design',
            'Advanced API security',
            'Microservice security',
            'Security tooling integration'
          ]
        }
      ],
      organizationId
    },

    // ===== DEVOPS ENGINEERING =====
    {
      id: 'role-devops-engineer-junior',
      title: 'DevOps Engineer (Junior)',
      focus: 'Infrastructure & Basic Security',
      category: 'DevOps Engineering',
      selectable: true,
      responsibilities: [
        'CI/CD pipeline maintenance',
        'Infrastructure deployment',
        'Basic monitoring',
        'Security awareness'
      ],
      securityContributions: [
        {
          title: 'Basic DevOps Security',
          bullets: [
            'Secure deployment practices',
            'Basic access control',
            'Security monitoring',
            'Backup procedures'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-devops-engineer-mid',
      title: 'DevOps Engineer (Mid-Level)',
      focus: 'Infrastructure Security & Automation',
      category: 'DevOps Engineering',
      selectable: true,
      responsibilities: [
        'Infrastructure as Code',
        'Security automation',
        'Monitoring and alerting',
        'Performance optimization'
      ],
      securityContributions: [
        {
          title: 'DevOps Security Implementation',
          bullets: [
            'Secure CI/CD practices',
            'Infrastructure security scanning',
            'Secrets management',
            'Compliance automation'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-devops-engineer-senior',
      title: 'DevOps Engineer (Senior)',
      focus: 'DevSecOps Leadership & Architecture',
      category: 'DevOps Engineering',
      selectable: true,
      responsibilities: [
        'DevSecOps strategy',
        'Security architecture',
        'Team leadership',
        'Cross-team collaboration'
      ],
      securityContributions: [
        {
          title: 'DevSecOps Architecture',
          bullets: [
            'Security by design',
            'Advanced automation',
            'Compliance frameworks',
            'Security tooling integration'
          ]
        }
      ],
      organizationId
    },

    // ===== SECURITY ENGINEERING =====
    {
      id: 'role-security-engineer-junior',
      title: 'Security Engineer (Junior)',
      focus: 'Security Implementation & Monitoring',
      category: 'Security Engineering',
      selectable: true,
      responsibilities: [
        'Security tool implementation',
        'Vulnerability scanning',
        'Incident response support',
        'Security awareness'
      ],
      securityContributions: [
        {
          title: 'Basic Security Implementation',
          bullets: [
            'Vulnerability assessment',
            'Security monitoring',
            'Basic incident response',
            'Security tooling'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-security-engineer-mid',
      title: 'Security Engineer (Mid-Level)',
      focus: 'Security Architecture & Automation',
      category: 'Security Engineering',
      selectable: true,
      responsibilities: [
        'Security architecture design',
        'Automation development',
        'Threat modeling',
        'Security training'
      ],
      securityContributions: [
        {
          title: 'Security Architecture',
          bullets: [
            'Threat modeling',
            'Security automation',
            'Advanced monitoring',
            'Incident response'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-security-engineer-senior',
      title: 'Security Engineer (Senior)',
      focus: 'Security Leadership & Strategy',
      category: 'Security Engineering',
      selectable: true,
      responsibilities: [
        'Security strategy development',
        'Team leadership',
        'Cross-team collaboration',
        'Security innovation'
      ],
      securityContributions: [
        {
          title: 'Security Leadership',
          bullets: [
            'Security strategy',
            'Advanced threat modeling',
            'Security innovation',
            'Team development'
          ]
        }
      ],
      organizationId
    },

    // ===== COMPLIANCE & GOVERNANCE =====
    {
      id: 'role-compliance-specialist-junior',
      title: 'Compliance Specialist (Junior)',
      focus: 'Compliance Implementation & Monitoring',
      category: 'Compliance & Governance',
      selectable: true,
      responsibilities: [
        'Compliance monitoring',
        'Policy implementation',
        'Audit support',
        'Documentation'
      ],
      securityContributions: [
        {
          title: 'Basic Compliance',
          bullets: [
            'Policy compliance',
            'Audit support',
            'Documentation',
            'Monitoring'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-compliance-specialist-mid',
      title: 'Compliance Specialist (Mid-Level)',
      focus: 'Compliance Strategy & Automation',
      category: 'Compliance & Governance',
      selectable: true,
      responsibilities: [
        'Compliance strategy',
        'Automation development',
        'Risk assessment',
        'Training delivery'
      ],
      securityContributions: [
        {
          title: 'Compliance Strategy',
          bullets: [
            'Risk assessment',
            'Compliance automation',
            'Policy development',
            'Training programs'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-compliance-specialist-senior',
      title: 'Compliance Specialist (Senior)',
      focus: 'Compliance Leadership & Innovation',
      category: 'Compliance & Governance',
      selectable: true,
      responsibilities: [
        'Compliance leadership',
        'Innovation strategy',
        'Cross-team collaboration',
        'Industry leadership'
      ],
      securityContributions: [
        {
          title: 'Compliance Leadership',
          bullets: [
            'Compliance innovation',
            'Industry leadership',
            'Advanced automation',
            'Strategic planning'
          ]
        }
      ],
      organizationId
    },

    // ===== DATA ENGINEERING =====
    {
      id: 'role-data-engineer-junior',
      title: 'Data Engineer (Junior)',
      focus: 'Data Pipeline Development & Basic Security',
      category: 'Data Engineering',
      selectable: true,
      responsibilities: [
        'Data pipeline development',
        'Basic data security',
        'ETL processes',
        'Data quality'
      ],
      securityContributions: [
        {
          title: 'Basic Data Security',
          bullets: [
            'Data encryption basics',
            'Access control',
            'Data quality',
            'Basic privacy'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-data-engineer-mid',
      title: 'Data Engineer (Mid-Level)',
      focus: 'Data Architecture & Security',
      category: 'Data Engineering',
      selectable: true,
      responsibilities: [
        'Data architecture design',
        'Security implementation',
        'Performance optimization',
        'Data governance'
      ],
      securityContributions: [
        {
          title: 'Data Security Implementation',
          bullets: [
            'Advanced encryption',
            'Privacy by design',
            'Data governance',
            'Compliance automation'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-data-engineer-senior',
      title: 'Data Engineer (Senior)',
      focus: 'Data Leadership & Security Architecture',
      category: 'Data Engineering',
      selectable: true,
      responsibilities: [
        'Data strategy development',
        'Security architecture',
        'Team leadership',
        'Innovation'
      ],
      securityContributions: [
        {
          title: 'Data Security Architecture',
          bullets: [
            'Security by design',
            'Advanced privacy',
            'Compliance frameworks',
            'Innovation leadership'
          ]
        }
      ],
      organizationId
    },

    // ===== AI & ML ENGINEERING =====
    {
      id: 'role-ai-engineer-junior',
      title: 'AI Engineer (Junior)',
      focus: 'AI Development & Basic Ethics',
      category: 'AI & ML Engineering',
      selectable: true,
      responsibilities: [
        'AI model development',
        'Basic ethics awareness',
        'Model testing',
        'Documentation'
      ],
      securityContributions: [
        {
          title: 'Basic AI Ethics',
          bullets: [
            'Bias awareness',
            'Transparency basics',
            'Model testing',
            'Documentation'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-ai-engineer-mid',
      title: 'AI Engineer (Mid-Level)',
      focus: 'AI Ethics & Security Implementation',
      category: 'AI & ML Engineering',
      selectable: true,
      responsibilities: [
        'AI ethics implementation',
        'Security development',
        'Model validation',
        'Compliance awareness'
      ],
      securityContributions: [
        {
          title: 'AI Ethics Implementation',
          bullets: [
            'Bias detection',
            'Transparency implementation',
            'Security validation',
            'Compliance automation'
          ]
        }
      ],
      organizationId
    },
    {
      id: 'role-ai-engineer-senior',
      title: 'AI Engineer (Senior)',
      focus: 'AI Governance & Leadership',
      category: 'AI & ML Engineering',
      selectable: true,
      responsibilities: [
        'AI governance strategy',
        'Ethics leadership',
        'Team development',
        'Industry leadership'
      ],
      securityContributions: [
        {
          title: 'AI Governance Leadership',
          bullets: [
            'Governance strategy',
            'Ethics innovation',
            'Compliance frameworks',
            'Industry leadership'
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

  return createdTemplates;
}

// =============================================================================
// PHASE 3: Role Agents (Unique Individuals)
// =============================================================================

async function createRoleAgents(organizationId, roleTemplates) {
  console.log('🤖 Creating role agents (unique individuals)...');

  // Create 150+ unique individuals across different roles
  const roleAgents = [];

  // Frontend Engineers (30 people)
  for (let i = 1; i <= 30; i++) {
    const level = i <= 10 ? 3 : i <= 20 ? 4 : 5;
    const trustScore = 700 + (level * 50) + Math.floor(Math.random() * 100);
    const templateId = level === 3 ? 'role-frontend-engineer-junior' :
      level === 4 ? 'role-frontend-engineer-mid' : 'role-frontend-engineer-senior';

    const agent = await prisma.roleAgent.create({
      data: {
        name: `L${level} Frontend Engineer - ${generateName()}`,
        description: `Frontend engineer with ${level === 3 ? 'junior' : level === 4 ? 'mid-level' : 'senior'} expertise`,
        assignedToDid: `did:ethr:0x${generateHex(40)}`,
        blockchainAddress: `0x${generateHex(40)}`,
        blockchainNetwork: 'ethereum',
        trustScore,
        level,
        loaLevel: `L${level}`,
        isEligibleForMint: level >= 4,
        status: 'active',
        ansIdentifier: `l${level}-frontend-engineer-${i}.enterprise-150.knaight`,
        ansRegistrationStatus: 'registered',
        roleTemplateId: templateId,
        organizationId
      }
    });

    roleAgents.push(agent);
    console.log(`✅ Created role agent: ${agent.name}`);
  }

  // Backend Engineers (35 people)
  for (let i = 1; i <= 35; i++) {
    const level = i <= 12 ? 3 : i <= 25 ? 4 : 5;
    const trustScore = 700 + (level * 50) + Math.floor(Math.random() * 100);
    const templateId = level === 3 ? 'role-backend-engineer-junior' :
      level === 4 ? 'role-backend-engineer-mid' : 'role-backend-engineer-senior';

    const agent = await prisma.roleAgent.create({
      data: {
        name: `L${level} Backend Engineer - ${generateName()}`,
        description: `Backend engineer with ${level === 3 ? 'junior' : level === 4 ? 'mid-level' : 'senior'} expertise`,
        assignedToDid: `did:ethr:0x${generateHex(40)}`,
        blockchainAddress: `0x${generateHex(40)}`,
        blockchainNetwork: 'ethereum',
        trustScore,
        level,
        loaLevel: `L${level}`,
        isEligibleForMint: level >= 4,
        status: 'active',
        ansIdentifier: `l${level}-backend-engineer-${i}.enterprise-150.knaight`,
        ansRegistrationStatus: 'registered',
        roleTemplateId: templateId,
        organizationId
      }
    });

    roleAgents.push(agent);
    console.log(`✅ Created role agent: ${agent.name}`);
  }

  // DevOps Engineers (25 people)
  for (let i = 1; i <= 25; i++) {
    const level = i <= 8 ? 3 : i <= 18 ? 4 : 5;
    const trustScore = 700 + (level * 50) + Math.floor(Math.random() * 100);
    const templateId = level === 3 ? 'role-devops-engineer-junior' :
      level === 4 ? 'role-devops-engineer-mid' : 'role-devops-engineer-senior';

    const agent = await prisma.roleAgent.create({
      data: {
        name: `L${level} DevOps Engineer - ${generateName()}`,
        description: `DevOps engineer with ${level === 3 ? 'junior' : level === 4 ? 'mid-level' : 'senior'} expertise`,
        assignedToDid: `did:ethr:0x${generateHex(40)}`,
        blockchainAddress: `0x${generateHex(40)}`,
        blockchainNetwork: 'ethereum',
        trustScore,
        level,
        loaLevel: `L${level}`,
        isEligibleForMint: level >= 4,
        status: 'active',
        ansIdentifier: `l${level}-devops-engineer-${i}.enterprise-150.knaight`,
        ansRegistrationStatus: 'registered',
        roleTemplateId: templateId,
        organizationId
      }
    });

    roleAgents.push(agent);
    console.log(`✅ Created role agent: ${agent.name}`);
  }

  // Security Engineers (20 people)
  for (let i = 1; i <= 20; i++) {
    const level = i <= 6 ? 3 : i <= 15 ? 4 : 5;
    const trustScore = 750 + (level * 50) + Math.floor(Math.random() * 100);
    const templateId = level === 3 ? 'role-security-engineer-junior' :
      level === 4 ? 'role-security-engineer-mid' : 'role-security-engineer-senior';

    const agent = await prisma.roleAgent.create({
      data: {
        name: `L${level} Security Engineer - ${generateName()}`,
        description: `Security engineer with ${level === 3 ? 'junior' : level === 4 ? 'mid-level' : 'senior'} expertise`,
        assignedToDid: `did:ethr:0x${generateHex(40)}`,
        blockchainAddress: `0x${generateHex(40)}`,
        blockchainNetwork: 'ethereum',
        trustScore,
        level,
        loaLevel: `L${level}`,
        isEligibleForMint: level >= 4,
        status: 'active',
        ansIdentifier: `l${level}-security-engineer-${i}.enterprise-150.knaight`,
        ansRegistrationStatus: 'registered',
        roleTemplateId: templateId,
        organizationId
      }
    });

    roleAgents.push(agent);
    console.log(`✅ Created role agent: ${agent.name}`);
  }

  // Compliance Specialists (15 people)
  for (let i = 1; i <= 15; i++) {
    const level = i <= 5 ? 3 : i <= 12 ? 4 : 5;
    const trustScore = 750 + (level * 50) + Math.floor(Math.random() * 100);
    const templateId = level === 3 ? 'role-compliance-specialist-junior' :
      level === 4 ? 'role-compliance-specialist-mid' : 'role-compliance-specialist-senior';

    const agent = await prisma.roleAgent.create({
      data: {
        name: `L${level} Compliance Specialist - ${generateName()}`,
        description: `Compliance specialist with ${level === 3 ? 'junior' : level === 4 ? 'mid-level' : 'senior'} expertise`,
        assignedToDid: `did:ethr:0x${generateHex(40)}`,
        blockchainAddress: `0x${generateHex(40)}`,
        blockchainNetwork: 'ethereum',
        trustScore,
        level,
        loaLevel: `L${level}`,
        isEligibleForMint: level >= 4,
        status: 'active',
        ansIdentifier: `l${level}-compliance-specialist-${i}.enterprise-150.knaight`,
        ansRegistrationStatus: 'registered',
        roleTemplateId: templateId,
        organizationId
      }
    });

    roleAgents.push(agent);
    console.log(`✅ Created role agent: ${agent.name}`);
  }

  // Data Engineers (15 people)
  for (let i = 1; i <= 15; i++) {
    const level = i <= 5 ? 3 : i <= 12 ? 4 : 5;
    const trustScore = 700 + (level * 50) + Math.floor(Math.random() * 100);
    const templateId = level === 3 ? 'role-data-engineer-junior' :
      level === 4 ? 'role-data-engineer-mid' : 'role-data-engineer-senior';

    const agent = await prisma.roleAgent.create({
      data: {
        name: `L${level} Data Engineer - ${generateName()}`,
        description: `Data engineer with ${level === 3 ? 'junior' : level === 4 ? 'mid-level' : 'senior'} expertise`,
        assignedToDid: `did:ethr:0x${generateHex(40)}`,
        blockchainAddress: `0x${generateHex(40)}`,
        blockchainNetwork: 'ethereum',
        trustScore,
        level,
        loaLevel: `L${level}`,
        isEligibleForMint: level >= 4,
        status: 'active',
        ansIdentifier: `l${level}-data-engineer-${i}.enterprise-150.knaight`,
        ansRegistrationStatus: 'registered',
        roleTemplateId: templateId,
        organizationId
      }
    });

    roleAgents.push(agent);
    console.log(`✅ Created role agent: ${agent.name}`);
  }

  // AI Engineers (10 people)
  for (let i = 1; i <= 10; i++) {
    const level = i <= 3 ? 3 : i <= 7 ? 4 : 5;
    const trustScore = 750 + (level * 50) + Math.floor(Math.random() * 100);
    const templateId = level === 3 ? 'role-ai-engineer-junior' :
      level === 4 ? 'role-ai-engineer-mid' : 'role-ai-engineer-senior';

    const agent = await prisma.roleAgent.create({
      data: {
        name: `L${level} AI Engineer - ${generateName()}`,
        description: `AI engineer with ${level === 3 ? 'junior' : level === 4 ? 'mid-level' : 'senior'} expertise`,
        assignedToDid: `did:ethr:0x${generateHex(40)}`,
        blockchainAddress: `0x${generateHex(40)}`,
        blockchainNetwork: 'ethereum',
        trustScore,
        level,
        loaLevel: `L${level}`,
        isEligibleForMint: level >= 4,
        status: 'active',
        ansIdentifier: `l${level}-ai-engineer-${i}.enterprise-150.knaight`,
        ansRegistrationStatus: 'registered',
        roleTemplateId: templateId,
        organizationId
      }
    });

    roleAgents.push(agent);
    console.log(`✅ Created role agent: ${agent.name}`);
  }

  console.log(`✅ Created ${roleAgents.length} role agents`);
  return roleAgents;
}

// =============================================================================
// PHASE 4: Certifications & Skills
// =============================================================================

async function createCertificationsAndSkills(roleAgents) {
  console.log('🎓 Creating certifications and skills...');

  const certifications = [
    // Security Certifications
    { name: 'CISSP', issuer: 'ISC2', verified: true },
    { name: 'CISM', issuer: 'ISACA', verified: true },
    { name: 'CISA', issuer: 'ISACA', verified: true },
    { name: 'CompTIA Security+', issuer: 'CompTIA', verified: true },
    { name: 'CEH', issuer: 'EC-Council', verified: true },
    { name: 'OSCP', issuer: 'Offensive Security', verified: true },

    // Cloud Security
    { name: 'AWS Security Specialty', issuer: 'Amazon Web Services', verified: true },
    { name: 'Azure Security Engineer', issuer: 'Microsoft', verified: true },
    { name: 'Google Cloud Security Engineer', issuer: 'Google Cloud', verified: true },

    // DevOps & Security
    { name: 'DevOps Foundation', issuer: 'DevOps Institute', verified: true },
    { name: 'Kubernetes Security Specialist', issuer: 'CNCF', verified: true },
    { name: 'Docker Security', issuer: 'Docker Inc.', verified: true },

    // Compliance
    { name: 'ISO 27001 Lead Auditor', issuer: 'ISO', verified: true },
    { name: 'GDPR Practitioner', issuer: 'IAPP', verified: true },
    { name: 'SOC2 Practitioner', issuer: 'AICPA', verified: true },

    // AI & Ethics
    { name: 'AI Ethics Certification', issuer: 'IEEE', verified: true },
    { name: 'Responsible AI', issuer: 'Microsoft', verified: true },
    { name: 'AI Governance', issuer: 'ISACA', verified: true }
  ];

  let certCount = 0;
  for (const roleAgent of roleAgents) {
    // Assign 1-3 random certifications per person
    const numCerts = Math.floor(Math.random() * 3) + 1;
    const selectedCerts = shuffleArray(certifications).slice(0, numCerts);

    for (const cert of selectedCerts) {
      const issuedAt = new Date(2022 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28));
      const expiresAt = new Date(issuedAt.getFullYear() + 3, issuedAt.getMonth(), issuedAt.getDate());

      await prisma.certification.create({
        data: {
          name: cert.name,
          issuer: cert.issuer,
          issuedAt,
          expiresAt,
          credentialUrl: `https://verify.${cert.issuer.toLowerCase().replace(/\s+/g, '')}.com`,
          verified: cert.verified,
          verificationMethod: `${cert.issuer} Verification Portal`,
          roleAgentId: roleAgent.id
        }
      });

      certCount++;
    }
  }

  console.log(`✅ Created ${certCount} certifications across ${roleAgents.length} role agents`);
}

// =============================================================================
// PHASE 5: Trust Thresholds & Policies
// =============================================================================

async function createTrustThresholdsAndPolicies(organizationId, roleTemplates) {
  console.log('🎯 Creating trust thresholds and policies...');

  // Create trust thresholds for each role template
  const trustThresholds = [
    { roleTitle: 'Frontend Engineer (Junior)', minTrustScore: 700 },
    { roleTitle: 'Frontend Engineer (Mid-Level)', minTrustScore: 800 },
    { roleTitle: 'Frontend Engineer (Senior)', minTrustScore: 900 },
    { roleTitle: 'Backend Engineer (Junior)', minTrustScore: 700 },
    { roleTitle: 'Backend Engineer (Mid-Level)', minTrustScore: 800 },
    { roleTitle: 'Backend Engineer (Senior)', minTrustScore: 900 },
    { roleTitle: 'DevOps Engineer (Junior)', minTrustScore: 700 },
    { roleTitle: 'DevOps Engineer (Mid-Level)', minTrustScore: 800 },
    { roleTitle: 'DevOps Engineer (Senior)', minTrustScore: 900 },
    { roleTitle: 'Security Engineer (Junior)', minTrustScore: 750 },
    { roleTitle: 'Security Engineer (Mid-Level)', minTrustScore: 850 },
    { roleTitle: 'Security Engineer (Senior)', minTrustScore: 950 },
    { roleTitle: 'Compliance Specialist (Junior)', minTrustScore: 750 },
    { roleTitle: 'Compliance Specialist (Mid-Level)', minTrustScore: 850 },
    { roleTitle: 'Compliance Specialist (Senior)', minTrustScore: 950 },
    { roleTitle: 'Data Engineer (Junior)', minTrustScore: 700 },
    { roleTitle: 'Data Engineer (Mid-Level)', minTrustScore: 800 },
    { roleTitle: 'Data Engineer (Senior)', minTrustScore: 900 },
    { roleTitle: 'AI Engineer (Junior)', minTrustScore: 750 },
    { roleTitle: 'AI Engineer (Mid-Level)', minTrustScore: 850 },
    { roleTitle: 'AI Engineer (Senior)', minTrustScore: 950 }
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
      requiredFacets: ['security', 'compliance', 'policy', 'architecture'],
      externalRequired: false,
      description: 'Senior role agent - comprehensive technical review'
    },
    {
      artifactType: 'RoleAgent',
      level: 'L5',
      minReviewers: 5,
      requiredFacets: ['security', 'compliance', 'policy', 'architecture', 'risk'],
      externalRequired: true,
      description: 'Lead role agent - comprehensive review with external validation'
    }
  ];

  for (const policyData of loaPolicies) {
    await prisma.loaPolicy.upsert({
      where: {
        organizationId_artifactType_level: {
          organizationId,
          artifactType: policyData.artifactType,
          level: policyData.level
        }
      },
      update: {},
      create: {
        organizationId,
        ...policyData,
        isActive: true
      }
    });
  }

  console.log(`✅ Created ${loaPolicies.length} LoA policies`);
}

// =============================================================================
// Utility Functions
// =============================================================================

function generateName() {
  const firstNames = [
    'Sarah', 'Marcus', 'Emily', 'Alex', 'David', 'Jennifer', 'Michael', 'Lisa',
    'James', 'Maria', 'Robert', 'Anna', 'William', 'Sophia', 'John', 'Emma',
    'Christopher', 'Olivia', 'Daniel', 'Ava', 'Matthew', 'Isabella', 'Anthony', 'Mia',
    'Mark', 'Charlotte', 'Donald', 'Amelia', 'Steven', 'Harper', 'Paul', 'Evelyn',
    'Andrew', 'Abigail', 'Joshua', 'Emily', 'Kenneth', 'Elizabeth', 'Kevin', 'Sofia',
    'Brian', 'Avery', 'George', 'Ella', 'Timothy', 'Madison', 'Ronald', 'Scarlett',
    'Jason', 'Victoria', 'Edward', 'Luna', 'Jeffrey', 'Grace', 'Ryan', 'Chloe'
  ];

  const lastNames = [
    'Chen', 'Rodriguez', 'Watson', 'Kim', 'Park', 'Johnson', 'Williams', 'Brown',
    'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez',
    'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez',
    'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott',
    'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker',
    'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips'
  ];

  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function generateHex(length) {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// =============================================================================
// Reporting
// =============================================================================

async function createSampleTeamCompositions(organizationId, roleAgents) {
  console.log('🎯 Creating sample team compositions...');

  const sampleCompositions = [
    {
      projectPhase: 'Threat Modeling',
      requirements: {
        skills: ['Threat Modeling', 'Risk Assessment', 'Security Architecture', 'OWASP'],
        trustMinLevel: 4,
        teamSize: 4
      }
    },
    {
      projectPhase: 'Implementation',
      requirements: {
        skills: ['TypeScript', 'React', 'Node.js', 'AWS', 'DevOps'],
        trustMinLevel: 3,
        teamSize: 6
      }
    },
    {
      projectPhase: 'Security Review',
      requirements: {
        skills: ['Penetration Testing', 'Vulnerability Assessment', 'ISO27001', 'SOC2'],
        trustMinLevel: 4,
        teamSize: 3
      }
    },
    {
      projectPhase: 'Compliance Audit',
      requirements: {
        skills: ['GDPR', 'NIST', 'Compliance', 'Risk Assessment'],
        trustMinLevel: 4,
        teamSize: 2
      }
    }
  ];

  for (const composition of sampleCompositions) {
    // Select random agents that match the requirements
    const availableAgents = roleAgents.filter(agent => 
      agent.trustScore && agent.trustScore >= (composition.requirements.trustMinLevel * 100)
    );
    
    const shuffledAgents = shuffleArray(availableAgents);
    const selectedTeam = shuffledAgents.slice(0, composition.requirements.teamSize);

    const suggestedTeam = selectedTeam.map(agent => ({
      id: agent.id,
      name: agent.name,
      role: agent.roleTemplate?.title || 'Unknown Role',
      trustScore: agent.trustScore || 0,
      skillMatchScore: Math.random() * 0.4 + 0.6, // 60-100% match
      skills: [agent.roleTemplate?.focus || 'General'],
      certifications: Math.floor(Math.random() * 5) + 1,
      signals: Math.floor(Math.random() * 10) + 5
    }));

    await prisma.teamComposition.create({
      data: {
        organizationId,
        projectPhase: composition.projectPhase,
        requirements: composition.requirements,
        suggestedTeam,
        gaps: Math.random() > 0.7 ? { missingSkills: ['Advanced AI/ML'] } : null
      }
    });

    console.log(`✅ Created team composition for ${composition.projectPhase}`);
  }

  console.log(`🎯 Created ${sampleCompositions.length} sample team compositions`);
}

async function generateEnterpriseReport() {
  console.log('\n📊 Enterprise 150+ Seeding Report');
  console.log('==================================');

  try {
    const orgs = await prisma.organization.count();
    const templates = await prisma.roleTemplate.count();
    const agents = await prisma.roleAgent.count();
    const certs = await prisma.certification.count();
    const thresholds = await prisma.roleTrustThreshold.count();
    const policies = await prisma.loaPolicy.count();
    const compositions = await prisma.teamComposition.count();

    console.log(`🏢 Organizations: ${orgs}`);
    console.log(`👤 Role Templates: ${templates}`);
    console.log(`🤖 Role Agents: ${agents}`);
    console.log(`🎓 Certifications: ${certs}`);
    console.log(`🎯 Trust Thresholds: ${thresholds}`);
    console.log(`📋 LoA Policies: ${policies}`);
    console.log(`👥 Team Compositions: ${compositions}`);

    const total = orgs + templates + agents + certs + thresholds + policies + compositions;
    console.log(`\n📈 Total seeded entities: ${total}`);
    console.log('✅ Enterprise 150+ platform is ready for comprehensive testing!');

    // Role distribution
    const roleDistribution = await prisma.roleAgent.groupBy({
      by: ['level'],
      _count: { level: true }
    });

    console.log('\n👥 Role Distribution by Level:');
    roleDistribution.forEach(group => {
      console.log(`  L${group.level}: ${group._count.level} people`);
    });

  } catch (error) {
    console.log('⚠️ Could not generate enterprise report:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  enterprise150Seed();
}

module.exports = { enterprise150Seed };
