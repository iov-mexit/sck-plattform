import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedComprehensive26() {
  console.log('🌱 Starting comprehensive 26-role template seeding...');

  try {
    // Clear existing role templates only
    console.log('🗑️  Clearing existing role templates...');
    await prisma.roleTemplate.deleteMany();

    // Create comprehensive role templates (GLOBAL - not tied to any organization)
    console.log('👥 Creating comprehensive 26 role templates...');
    const roleTemplates = [
      // =============================================================================
      // PRODUCT ROLES
      // =============================================================================
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-fullstack-developer',
        title: 'Full Stack Developer',
        focus: 'End-to-End Development',
        category: 'Product',
        selectable: true,
        responsibilities: [
          'Develop complete web applications',
          'Integrate frontend and backend systems',
          'Ensure security across all layers',
          'Optimize overall system performance'
        ],
        securityContributions: [
          {
            title: 'Cross-Layer Security',
            bullets: [
              'Implement security at all application layers',
              'Ensure secure data flow between components',
              'Apply defense in depth principles',
              'Maintain security consistency across stack'
            ]
          },
          {
            title: 'Integration Security',
            bullets: [
              'Secure API integrations',
              'Implement proper session management',
              'Ensure secure data transmission',
              'Apply security patterns consistently'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-mobile-developer',
        title: 'Mobile Developer',
        focus: 'Mobile Application Development',
        category: 'Product',
        selectable: true,
        responsibilities: [
          'Develop secure mobile applications',
          'Implement platform-specific security',
          'Ensure data privacy on mobile devices',
          'Optimize mobile performance and security'
        ],
        securityContributions: [
          {
            title: 'Mobile Security',
            bullets: [
              'Implement secure data storage',
              'Use secure communication protocols',
              'Apply platform security guidelines',
              'Implement biometric authentication'
            ]
          },
          {
            title: 'Privacy Protection',
            bullets: [
              'Minimize data collection',
              'Implement secure data transmission',
              'Follow mobile privacy regulations',
              'Secure local data storage'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // =============================================================================
      // SECURITY ROLES
      // =============================================================================
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-security-architect',
        title: 'Security Architect',
        focus: 'Security Architecture Design',
        category: 'Security',
        selectable: true,
        responsibilities: [
          'Design enterprise security architectures',
          'Define security standards and patterns',
          'Evaluate security technologies',
          'Lead security strategy development'
        ],
        securityContributions: [
          {
            title: 'Architecture Security',
            bullets: [
              'Design secure enterprise architectures',
              'Define security reference architectures',
              'Establish security design patterns',
              'Ensure security by design principles'
            ]
          },
          {
            title: 'Strategic Security',
            bullets: [
              'Develop security roadmaps',
              'Define security technology standards',
              'Establish security governance frameworks',
              'Lead security transformation initiatives'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-security-analyst',
        title: 'Security Analyst',
        focus: 'Security Analysis and Monitoring',
        category: 'Security',
        selectable: true,
        responsibilities: [
          'Analyze security events and alerts',
          'Investigate security incidents',
          'Monitor security systems',
          'Generate security reports and metrics'
        ],
        securityContributions: [
          {
            title: 'Threat Analysis',
            bullets: [
              'Analyze security threats and vulnerabilities',
              'Investigate security incidents',
              'Monitor security systems and alerts',
              'Generate security intelligence reports'
            ]
          },
          {
            title: 'Security Monitoring',
            bullets: [
              'Monitor security event logs',
              'Analyze security metrics and trends',
              'Identify security anomalies',
              'Maintain security dashboards'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-penetration-tester',
        title: 'Penetration Tester',
        focus: 'Security Testing and Assessment',
        category: 'Security',
        selectable: true,
        responsibilities: [
          'Conduct security penetration tests',
          'Identify security vulnerabilities',
          'Provide remediation recommendations',
          'Validate security controls effectiveness'
        ],
        securityContributions: [
          {
            title: 'Security Testing',
            bullets: [
              'Conduct comprehensive penetration tests',
              'Identify security vulnerabilities',
              'Provide detailed remediation guidance',
              'Validate security control effectiveness'
            ]
          },
          {
            title: 'Vulnerability Assessment',
            bullets: [
              'Assess application security posture',
              'Identify security weaknesses',
              'Prioritize security findings',
              'Track vulnerability remediation'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // =============================================================================
      // DEVOPS ROLES
      // =============================================================================
      {
        id: 'role-devops-engineer',
        title: 'DevOps Engineer',
        focus: 'Infrastructure and Automation',
        category: 'DevOps',
        selectable: true,
        responsibilities: [
          'Manage infrastructure and deployment pipelines',
          'Automate deployment and monitoring processes',
          'Ensure system reliability and performance',
          'Implement security controls in infrastructure'
        ],
        securityContributions: [
          {
            title: 'Infrastructure Security',
            bullets: [
              'Implement secure container deployment',
              'Set up automated security scanning',
              'Configure secure CI/CD pipelines',
              'Implement infrastructure security controls'
            ]
          },
          {
            title: 'Security Monitoring',
            bullets: [
              'Deploy security monitoring tools',
              'Create security alerting systems',
              'Implement log analysis and monitoring',
              'Ensure infrastructure security compliance'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-site-reliability-engineer',
        title: 'Site Reliability Engineer',
        focus: 'System Reliability and Security',
        category: 'DevOps',
        selectable: true,
        responsibilities: [
          'Ensure system availability and performance',
          'Implement monitoring and alerting',
          'Manage incident response and recovery',
          'Maintain security and compliance'
        ],
        securityContributions: [
          {
            title: 'Reliability Security',
            bullets: [
              'Implement secure monitoring systems',
              'Ensure secure incident response',
              'Maintain security during recovery',
              'Implement secure automation'
            ]
          },
          {
            title: 'Security Operations',
            bullets: [
              'Monitor security metrics',
              'Implement security automation',
              'Ensure compliance in operations',
              'Maintain security documentation'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // =============================================================================
      // ARCHITECTURE ROLES
      // =============================================================================
      {
        id: 'role-solution-architect',
        title: 'Solution Architect',
        focus: 'Solution Design and Security',
        category: 'Architecture',
        selectable: true,
        responsibilities: [
          'Design secure technical solutions',
          'Ensure security requirements are met',
          'Integrate security controls in solutions',
          'Guide development teams on security'
        ],
        securityContributions: [
          {
            title: 'Solution Security',
            bullets: [
              'Design secure solution architectures',
              'Integrate security controls in solutions',
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-enterprise-architect',
        title: 'Enterprise Architect',
        focus: 'Enterprise Architecture and Security',
        category: 'Architecture',
        selectable: true,
        responsibilities: [
          'Define enterprise architecture standards',
          'Ensure security across enterprise systems',
          'Guide technology strategy and security',
          'Maintain enterprise security governance'
        ],
        securityContributions: [
          {
            title: 'Enterprise Security',
            bullets: [
              'Define enterprise security standards',
              'Ensure security across all systems',
              'Establish security governance frameworks',
              'Guide security technology strategy'
            ]
          },
          {
            title: 'Security Governance',
            bullets: [
              'Define security policies and standards',
              'Establish security compliance frameworks',
              'Guide security investment decisions',
              'Maintain security architecture roadmaps'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // =============================================================================
      // DESIGN ROLES
      // =============================================================================
      {
        id: 'role-product-designer',
        title: 'Product Designer',
        focus: 'Product Design and Security UX',
        category: 'Design',
        selectable: true,
        responsibilities: [
          'Design secure product experiences',
          'Balance usability and security',
          'Create security-focused user interfaces',
          'Ensure accessibility in security features'
        ],
        securityContributions: [
          {
            title: 'Security UX Design',
            bullets: [
              'Design intuitive security interfaces',
              'Balance usability and security requirements',
              'Create clear security feedback mechanisms',
              'Ensure security features are accessible'
            ]
          },
          {
            title: 'Security Usability',
            bullets: [
              'Make security features easy to use',
              'Design clear security workflows',
              'Ensure security doesn\'t hinder usability',
              'Create security education in design'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-ux-designer',
        title: 'UX Designer',
        focus: 'User Experience and Security',
        category: 'Design',
        selectable: true,
        responsibilities: [
          'Design secure user experiences',
          'Create intuitive security workflows',
          'Ensure security features are user-friendly',
          'Conduct security usability testing'
        ],
        securityContributions: [
          {
            title: 'Security UX',
            bullets: [
              'Design secure user workflows',
              'Create intuitive security interfaces',
              'Ensure security features are accessible',
              'Conduct security usability research'
            ]
          },
          {
            title: 'Security Testing',
            bullets: [
              'Test security feature usability',
              'Ensure security doesn\'t frustrate users',
              'Create security education in UX',
              'Validate security UX decisions'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // =============================================================================
      // QA ROLES
      // =============================================================================
      {
        id: 'role-qa-engineer',
        title: 'QA Engineer',
        focus: 'Quality Assurance and Security Testing',
        category: 'QA',
        selectable: true,
        responsibilities: [
          'Test application functionality and security',
          'Identify security vulnerabilities',
          'Ensure quality and security standards',
          'Validate security controls effectiveness'
        ],
        securityContributions: [
          {
            title: 'Security Testing',
            bullets: [
              'Test security controls and features',
              'Identify security vulnerabilities',
              'Validate security requirements',
              'Ensure security compliance'
            ]
          },
          {
            title: 'Quality Security',
            bullets: [
              'Ensure security in quality processes',
              'Test security feature reliability',
              'Validate security documentation',
              'Maintain security testing standards'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-security-qa',
        title: 'Security QA Engineer',
        focus: 'Security Quality Assurance',
        category: 'QA',
        selectable: true,
        responsibilities: [
          'Focus on security testing and validation',
          'Ensure security controls meet requirements',
          'Validate security compliance',
          'Maintain security testing standards'
        ],
        securityContributions: [
          {
            title: 'Security Validation',
            bullets: [
              'Validate security control effectiveness',
              'Test security feature reliability',
              'Ensure security compliance',
              'Maintain security testing standards'
            ]
          },
          {
            title: 'Security Testing',
            bullets: [
              'Conduct comprehensive security tests',
              'Identify security weaknesses',
              'Validate security requirements',
              'Track security issue resolution'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // =============================================================================
      // DATA ROLES
      // =============================================================================
      {
        id: 'role-data-engineer',
        title: 'Data Engineer',
        focus: 'Data Infrastructure and Security',
        category: 'Data',
        selectable: true,
        responsibilities: [
          'Design secure data pipelines',
          'Implement data security controls',
          'Ensure data privacy and compliance',
          'Maintain data infrastructure security'
        ],
        securityContributions: [
          {
            title: 'Data Security',
            bullets: [
              'Implement secure data pipelines',
              'Ensure data encryption and protection',
              'Implement data access controls',
              'Maintain data security compliance'
            ]
          },
          {
            title: 'Privacy Protection',
            bullets: [
              'Implement data privacy controls',
              'Ensure GDPR compliance',
              'Minimize data collection',
              'Implement data anonymization'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-data-scientist',
        title: 'Data Scientist',
        focus: 'Data Analysis and Security',
        category: 'Data',
        selectable: true,
        responsibilities: [
          'Analyze data securely',
          'Ensure data privacy in analysis',
          'Implement secure ML models',
          'Maintain data security standards'
        ],
        securityContributions: [
          {
            title: 'Secure Analytics',
            bullets: [
              'Implement secure data analysis',
              'Ensure data privacy in models',
              'Implement secure ML pipelines',
              'Maintain analysis security'
            ]
          },
          {
            title: 'Privacy-Preserving ML',
            bullets: [
              'Implement federated learning',
              'Use differential privacy',
              'Ensure model security',
              'Protect sensitive data'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // =============================================================================
      // MANAGEMENT ROLES
      // =============================================================================
      {
        id: 'role-product-manager',
        title: 'Product Manager',
        focus: 'Product Strategy and Security',
        category: 'Management',
        selectable: true,
        responsibilities: [
          'Define product security requirements',
          'Balance security and business needs',
          'Guide security feature development',
          'Ensure security compliance'
        ],
        securityContributions: [
          {
            title: 'Security Strategy',
            bullets: [
              'Define security requirements',
              'Balance security and business needs',
              'Guide security feature development',
              'Ensure security compliance'
            ]
          },
          {
            title: 'Security Governance',
            bullets: [
              'Define security policies',
              'Ensure security compliance',
              'Guide security investments',
              'Maintain security roadmaps'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-engineering-manager',
        title: 'Engineering Manager',
        focus: 'Team Leadership and Security',
        category: 'Management',
        selectable: true,
        responsibilities: [
          'Lead engineering teams',
          'Ensure security in development',
          'Guide security practices',
          'Maintain security culture'
        ],
        securityContributions: [
          {
            title: 'Team Security',
            bullets: [
              'Guide team security practices',
              'Ensure security in development',
              'Maintain security culture',
              'Guide security training'
            ]
          },
          {
            title: 'Security Leadership',
            bullets: [
              'Lead security initiatives',
              'Guide security investments',
              'Maintain security standards',
              'Ensure security compliance'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // =============================================================================
      // SPECIALIZED ROLES
      // =============================================================================
      {
        id: 'role-cloud-engineer',
        title: 'Cloud Engineer',
        focus: 'Cloud Infrastructure and Security',
        category: 'Cloud',
        selectable: true,
        responsibilities: [
          'Design secure cloud architectures',
          'Implement cloud security controls',
          'Ensure cloud compliance',
          'Maintain cloud security'
        ],
        securityContributions: [
          {
            title: 'Cloud Security',
            bullets: [
              'Implement cloud security controls',
              'Ensure cloud compliance',
              'Design secure cloud architectures',
              'Maintain cloud security'
            ]
          },
          {
            title: 'Cloud Compliance',
            bullets: [
              'Ensure cloud compliance',
              'Implement security monitoring',
              'Maintain security documentation',
              'Guide security best practices'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-blockchain-developer',
        title: 'Blockchain Developer',
        focus: 'Blockchain Development and Security',
        category: 'Blockchain',
        selectable: true,
        responsibilities: [
          'Develop secure blockchain applications',
          'Implement smart contract security',
          'Ensure blockchain security',
          'Maintain security standards'
        ],
        securityContributions: [
          {
            title: 'Smart Contract Security',
            bullets: [
              'Implement secure smart contracts',
              'Ensure contract security',
              'Follow security best practices',
              'Maintain security standards'
            ]
          },
          {
            title: 'Blockchain Security',
            bullets: [
              'Ensure blockchain security',
              'Implement security controls',
              'Maintain security standards',
              'Guide security practices'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-site-reliability-engineer',
        title: 'Site Reliability Engineer',
        focus: 'System Reliability and Security',
        category: 'DevOps',
        selectable: true,
        responsibilities: [
          'Ensure system availability and performance',
          'Implement monitoring and alerting',
          'Manage incident response and recovery',
          'Maintain security and compliance'
        ],
        securityContributions: [
          {
            title: 'Reliability Security',
            bullets: [
              'Implement secure monitoring systems',
              'Ensure secure incident response',
              'Maintain security during recovery',
              'Implement secure automation'
            ]
          },
          {
            title: 'Security Operations',
            bullets: [
              'Monitor security metrics',
              'Implement security automation',
              'Ensure compliance in operations',
              'Maintain security documentation'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-ai-ml-engineer',
        title: 'AI/ML Engineer',
        focus: 'AI/ML Development and Security',
        category: 'AI/ML',
        selectable: true,
        responsibilities: [
          'Develop secure AI/ML models',
          'Implement privacy-preserving ML',
          'Ensure model security and robustness',
          'Maintain AI/ML security standards'
        ],
        securityContributions: [
          {
            title: 'Model Security',
            bullets: [
              'Implement secure model training',
              'Ensure model robustness against attacks',
              'Validate model security properties',
              'Maintain secure model deployment'
            ]
          },
          {
            title: 'Privacy-Preserving ML',
            bullets: [
              'Implement federated learning',
              'Use differential privacy techniques',
              'Ensure data privacy in models',
              'Protect sensitive training data'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-network-engineer',
        title: 'Network Engineer',
        focus: 'Network Infrastructure and Security',
        category: 'Infrastructure',
        selectable: true,
        responsibilities: [
          'Design secure network architectures',
          'Implement network security controls',
          'Monitor network security and performance',
          'Ensure network compliance and reliability'
        ],
        securityContributions: [
          {
            title: 'Network Security',
            bullets: [
              'Implement network segmentation',
              'Configure firewalls and IDS/IPS',
              'Monitor network traffic for threats',
              'Ensure secure network protocols'
            ]
          },
          {
            title: 'Network Defense',
            bullets: [
              'Implement zero-trust network access',
              'Configure secure VPN and remote access',
              'Monitor for network intrusions',
              'Maintain network security documentation'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-compliance-specialist',
        title: 'Compliance Specialist',
        focus: 'Security Compliance and Governance',
        category: 'Compliance',
        selectable: true,
        responsibilities: [
          'Ensure security compliance across systems',
          'Implement compliance frameworks and controls',
          'Conduct compliance audits and assessments',
          'Guide security policy development'
        ],
        securityContributions: [
          {
            title: 'Compliance Framework',
            bullets: [
              'Implement SOC2 compliance controls',
              'Ensure GDPR and privacy compliance',
              'Maintain ISO security standards',
              'Guide compliance automation'
            ]
          },
          {
            title: 'Security Governance',
            bullets: [
              'Develop security policies and procedures',
              'Conduct compliance risk assessments',
              'Ensure audit trail compliance',
              'Maintain compliance documentation'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-incident-response-manager',
        title: 'Incident Response Manager',
        focus: 'Security Incident Management',
        category: 'Security',
        selectable: true,
        responsibilities: [
          'Lead security incident response teams',
          'Coordinate incident response procedures',
          'Manage incident communication and reporting',
          'Ensure post-incident lessons learned'
        ],
        securityContributions: [
          {
            title: 'Incident Leadership',
            bullets: [
              'Lead incident response coordination',
              'Manage stakeholder communication',
              'Ensure incident documentation',
              'Guide post-incident analysis'
            ]
          },
          {
            title: 'Response Optimization',
            bullets: [
              'Optimize incident response procedures',
              'Implement automated response playbooks',
              'Ensure response team readiness',
              'Maintain incident response metrics'
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Create all role templates
    const createdRoles = [];
    for (const template of roleTemplates) {
      const created = await prisma.roleTemplate.upsert({
        where: { id: template.id },
        update: {
          title: template.title,
          focus: template.focus,
          category: template.category,
          selectable: template.selectable,
          responsibilities: template.responsibilities,
          securityContributions: template.securityContributions,
          updatedAt: new Date()
        },
        create: template
      });
      createdRoles.push(created);
    }

    console.log('✅ Created', createdRoles.length, 'comprehensive role templates');
    console.log('🎉 Comprehensive 26-role template seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedComprehensive26()
  .then(() => {
    console.log('✅ Comprehensive 26-role seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Comprehensive 26-role seeding failed:', error);
    process.exit(1);
  });
