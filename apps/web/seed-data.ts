import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();

async function seedData() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.blockchain_transactions.deleteMany();
    await prisma.certifications.deleteMany();
    await prisma.signals.deleteMany();
    await prisma.digital_twins.deleteMany();
    await prisma.role_templates.deleteMany();
    await prisma.organizations.deleteMany();

    // Create organization
    console.log('🏢 Creating organization...');
    let organization = await prisma.organizations.findUnique({
      where: { id: 'org-securecodecorp' }
    });

    if (!organization) {
      organization = await prisma.organizations.create({
        data: {
          id: 'org-securecodecorp',
          name: 'SecureCode Corp',
          description: 'Leading cybersecurity company specializing in secure software development',
          domain: 'securecodecorp.com',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }

    // Create comprehensive role templates
    console.log('👥 Creating role templates...');
    const roleTemplates = [
      // Product Category
      {
        id: 'role-frontend-developer',
        title: 'Frontend Developer',
        focus: 'User Interface Development',
        category: 'Product',
        selectable: true,
        responsibilities: [
          'Build responsive web interfaces',
          'Implement security best practices',
          'Ensure accessibility compliance',
          'Optimize performance and user experience'
        ],
        securityContributions: [
          {
            title: 'Security Code Reviews',
            bullets: [
              'Review code for XSS vulnerabilities',
              'Ensure proper input validation',
              'Implement secure authentication flows',
              'Follow OWASP security guidelines'
            ]
          },
          {
            title: 'Security Best Practices',
            bullets: [
              'Use HTTPS for all communications',
              'Implement Content Security Policy',
              'Sanitize user inputs',
              'Follow secure coding standards'
            ]
          }
        ],
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-backend-developer',
        title: 'Backend Developer',
        focus: 'Server-Side Development',
        category: 'Product',
        selectable: true,
        responsibilities: [
          'Design and implement APIs',
          'Ensure data security and privacy',
          'Optimize database performance',
          'Maintain system reliability'
        ],
        securityContributions: [
          {
            title: 'API Security',
            bullets: [
              'Implement proper authentication and authorization',
              'Use rate limiting and input validation',
              'Encrypt sensitive data in transit and at rest',
              'Follow secure API design principles'
            ]
          },
          {
            title: 'Data Protection',
            bullets: [
              'Implement proper data encryption',
              'Use secure database connections',
              'Follow GDPR and privacy regulations',
              'Implement audit logging'
            ]
          }
        ],
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-product-manager',
        title: 'Product Manager',
        focus: 'Product Strategy & Security',
        category: 'Product',
        selectable: true,
        responsibilities: [
          'Define product security requirements',
          'Coordinate security features development',
          'Ensure compliance with security standards',
          'Manage security-focused product roadmaps'
        ],
        securityContributions: [
          {
            title: 'Security Requirements',
            bullets: [
              'Define security requirements for all features',
              'Ensure privacy-by-design principles',
              'Coordinate security testing and validation',
              'Manage security incident response procedures'
            ]
          },
          {
            title: 'Compliance Management',
            bullets: [
              'Ensure GDPR and privacy compliance',
              'Implement security controls in product design',
              'Coordinate with security teams',
              'Manage security documentation'
            ]
          }
        ],
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Design Category
      {
        id: 'role-ux-designer',
        title: 'UX Designer',
        focus: 'User Experience & Security',
        category: 'Design',
        selectable: true,
        responsibilities: [
          'Design secure user interfaces',
          'Create privacy-focused user flows',
          'Ensure accessibility in security features',
          'Design intuitive security controls'
        ],
        securityContributions: [
          {
            title: 'Security UX Design',
            bullets: [
              'Design intuitive authentication flows',
              'Create clear security status indicators',
              'Design privacy controls and settings',
              'Ensure security features are user-friendly'
            ]
          },
          {
            title: 'Privacy-First Design',
            bullets: [
              'Implement privacy-by-design principles',
              'Design transparent data collection flows',
              'Create clear consent mechanisms',
              'Design secure data visualization'
            ]
          }
        ],
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-security-designer',
        title: 'Security Designer',
        focus: 'Security Interface Design',
        category: 'Design',
        selectable: true,
        responsibilities: [
          'Design security dashboards',
          'Create threat visualization interfaces',
          'Design incident response workflows',
          'Create security awareness materials'
        ],
        securityContributions: [
          {
            title: 'Security Dashboard Design',
            bullets: [
              'Design real-time security monitoring interfaces',
              'Create intuitive threat visualization',
              'Design incident response workflows',
              'Create security metrics dashboards'
            ]
          },
          {
            title: 'Security Awareness Design',
            bullets: [
              'Design security training materials',
              'Create phishing awareness interfaces',
              'Design security policy communication',
              'Create security incident reporting flows'
            ]
          }
        ],
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // QA Category
      {
        id: 'role-security-qa',
        title: 'Security QA Engineer',
        focus: 'Security Testing & Quality Assurance',
        category: 'QA',
        selectable: true,
        responsibilities: [
          'Conduct security testing',
          'Perform penetration testing',
          'Validate security controls',
          'Ensure compliance testing'
        ],
        securityContributions: [
          {
            title: 'Security Testing',
            bullets: [
              'Conduct automated security testing',
              'Perform manual penetration testing',
              'Validate security controls effectiveness',
              'Test incident response procedures'
            ]
          },
          {
            title: 'Compliance Testing',
            bullets: [
              'Test GDPR compliance features',
              'Validate privacy controls',
              'Test audit logging functionality',
              'Ensure regulatory compliance'
            ]
          }
        ],
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-quality-engineer',
        title: 'Quality Engineer',
        focus: 'Quality Assurance & Security',
        category: 'QA',
        selectable: true,
        responsibilities: [
          'Ensure code quality standards',
          'Implement security testing in CI/CD',
          'Validate security requirements',
          'Maintain testing frameworks'
        ],
        securityContributions: [
          {
            title: 'Security Testing Integration',
            bullets: [
              'Integrate security testing in CI/CD pipelines',
              'Automate security test execution',
              'Validate security requirements coverage',
              'Maintain security testing frameworks'
            ]
          },
          {
            title: 'Quality Security Standards',
            bullets: [
              'Ensure secure coding standards',
              'Validate security controls in testing',
              'Test security incident procedures',
              'Maintain security documentation'
            ]
          }
        ],
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Architecture Category
      {
        id: 'role-security-architect',
        title: 'Security Architect',
        focus: 'Security Architecture Design',
        category: 'Architecture',
        selectable: true,
        responsibilities: [
          'Design secure system architectures',
          'Define security patterns and standards',
          'Conduct security assessments',
          'Create security reference architectures'
        ],
        securityContributions: [
          {
            title: 'Security Architecture Design',
            bullets: [
              'Design zero-trust security architectures',
              'Create security reference patterns',
              'Define security standards and guidelines',
              'Conduct architectural security reviews'
            ]
          },
          {
            title: 'Security Assessment',
            bullets: [
              'Perform security architecture assessments',
              'Conduct threat modeling exercises',
              'Define security controls and monitoring',
              'Create security architecture documentation'
            ]
          }
        ],
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-solution-architect',
        title: 'Solution Architect',
        focus: 'Solution Design & Security',
        category: 'Architecture',
        selectable: true,
        responsibilities: [
          'Design secure solutions',
          'Integrate security requirements',
          'Ensure scalability and security',
          'Define technical security standards'
        ],
        securityContributions: [
          {
            title: 'Secure Solution Design',
            bullets: [
              'Design secure solution architectures',
              'Integrate security controls in solutions',
              'Ensure compliance in solution design',
              'Define security integration patterns'
            ]
          },
          {
            title: 'Security Integration',
            bullets: [
              'Integrate security tools and controls',
              'Design secure data flows',
              'Ensure security in solution deployment',
              'Define security monitoring requirements'
            ]
          }
        ],
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Solution Design Category
      {
        id: 'role-solution-designer',
        title: 'Solution Designer',
        focus: 'Solution Design & Security',
        category: 'Solution Design',
        selectable: true,
        responsibilities: [
          'Design secure business solutions',
          'Integrate security requirements',
          'Ensure compliance in design',
          'Create security-focused solutions'
        ],
        securityContributions: [
          {
            title: 'Secure Solution Design',
            bullets: [
              'Design security-focused business solutions',
              'Integrate privacy controls in solutions',
              'Ensure compliance in solution design',
              'Create secure user workflows'
            ]
          },
          {
            title: 'Security Integration',
            bullets: [
              'Integrate security controls in solutions',
              'Design secure data processing flows',
              'Ensure audit trail in solutions',
              'Create security monitoring integration'
            ]
          }
        ],
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Security Category (Additional)
      {
        id: 'role-security-engineer',
        title: 'Security Engineer',
        focus: 'Security Infrastructure',
        category: 'Security',
        selectable: true,
        responsibilities: [
          'Design and implement security controls',
          'Conduct security assessments',
          'Monitor and respond to security incidents',
          'Develop security policies and procedures'
        ],
        securityContributions: [
          {
            title: 'Security Infrastructure',
            bullets: [
              'Design secure system architectures',
              'Implement zero-trust security models',
              'Conduct threat modeling and risk assessments',
              'Develop security controls and monitoring'
            ]
          },
          {
            title: 'Incident Response',
            bullets: [
              'Lead security incident investigations',
              'Develop incident response procedures',
              'Coordinate with stakeholders during incidents',
              'Implement security monitoring and alerting'
            ]
          }
        ],
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-devops-engineer',
        title: 'DevOps Engineer',
        focus: 'Infrastructure Security',
        category: 'DevOps',
        selectable: true,
        responsibilities: [
          'Secure infrastructure deployment',
          'Implement CI/CD security practices',
          'Monitor system security',
          'Automate security processes'
        ],
        securityContributions: [
          {
            title: 'Infrastructure Security',
            bullets: [
              'Implemented secure container deployment',
              'Set up automated security scanning',
              'Configured secure CI/CD pipelines'
            ]
          },
          {
            title: 'Security Monitoring',
            bullets: [
              'Deployed security monitoring tools',
              'Created security alerting systems',
              'Implemented log analysis'
            ]
          }
        ],
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const template of roleTemplates) {
      await prisma.role_templates.create({
        data: template
      });
    }

    console.log(`✅ Created ${roleTemplates.length} role templates`);

    // Create digital twins
    console.log('🤖 Creating digital twins...');
    const digitalTwins = [
      {
        id: 'twin-alice-security',
        name: 'Alice Security',
        assignedToDid: 'did:ethr:0x1234567890123456789012345678901234567890',
        roleTemplateId: 'role-security-engineer',
        description: 'Senior Security Engineer with 5+ years experience',
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'twin-bob-frontend',
        name: 'Bob Frontend',
        assignedToDid: 'did:ethr:0x2345678901234567890123456789012345678901',
        roleTemplateId: 'role-frontend-developer',
        description: 'Frontend Developer focused on security',
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'twin-carol-architect',
        name: 'Carol Architect',
        assignedToDid: 'did:ethr:0x3456789012345678901234567890123456789012',
        roleTemplateId: 'role-security-architect',
        description: 'Security Architect with enterprise experience',
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const twin of digitalTwins) {
      await prisma.digital_twins.create({
        data: twin
      });
    }

    console.log(`✅ Created ${digitalTwins.length} digital twins`);

    // Create signals
    console.log('📡 Creating signals...');
    const signals = [
      {
        id: 'signal-1',
        type: 'security_incident',
        severity: 'high',
        title: 'Suspicious login attempt detected',
        description: 'Multiple failed login attempts from unknown IP',
        source: 'auth_system',
        digitalTwinId: 'twin-alice-security',
        metadata: {
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0...',
          timestamp: new Date().toISOString()
        },
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'signal-2',
        type: 'vulnerability_scan',
        severity: 'medium',
        title: 'New vulnerability detected in dependencies',
        description: 'CVE-2023-1234 found in package.json',
        source: 'dependency_scanner',
        digitalTwinId: 'twin-bob-frontend',
        metadata: {
          package: 'lodash',
          version: '4.17.21',
          cve: 'CVE-2023-1234'
        },
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const signal of signals) {
      await prisma.signals.create({
        data: signal
      });
    }

    console.log(`✅ Created ${signals.length} signals`);

    // Create certifications
    console.log('🏆 Creating certifications...');
    const certifications = [
      {
        id: 'cert-1',
        name: 'Security Incident Response',
        issuer: 'Secure Code Warrior',
        issuedAt: new Date('2024-01-15'),
        type: 'security_incident_response',
        title: 'Security Incident Response Certification',
        description: 'Successfully handled 10+ security incidents',
        digitalTwinId: 'twin-alice-security',
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'cert-2',
        name: 'Secure Coding Practices',
        issuer: 'Secure Code Warrior',
        issuedAt: new Date('2024-02-20'),
        type: 'secure_coding',
        title: 'Secure Coding Practices Certification',
        description: 'Completed secure coding training and passed assessment',
        digitalTwinId: 'twin-bob-frontend',
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const cert of certifications) {
      await prisma.certifications.create({
        data: cert
      });
    }

    console.log(`✅ Created ${certifications.length} certifications`);

    // Create blockchain transactions
    console.log('⛓️  Creating blockchain transactions...');
    const blockchainTransactions = [
      {
        id: 'tx-1',
        transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
        network: 'ethereum',
        type: 'achievement_minted',
        hash: '0x1234567890abcdef1234567890abcdef12345678',
        digitalTwinId: 'twin-alice-security',
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'tx-2',
        transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12',
        network: 'ethereum',
        type: 'certification_verified',
        hash: '0xabcdef1234567890abcdef1234567890abcdef12',
        digitalTwinId: 'twin-bob-frontend',
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const tx of blockchainTransactions) {
      await prisma.blockchain_transactions.create({
        data: tx
      });
    }

    console.log(`✅ Created ${blockchainTransactions.length} blockchain transactions`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedData()
  .then(() => {
    console.log('✅ Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }); 