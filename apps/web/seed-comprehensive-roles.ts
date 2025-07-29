import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();

async function seedComprehensiveRoles() {
  console.log('🌱 Seeding comprehensive role templates...');

  try {
    // Find the organization
    const organization = await prisma.organizations.findUnique({
      where: { domain: 'securecodecorp.com' },
    });

    if (!organization) {
      console.error('❌ Organization not found');
      return;
    }

    // Define comprehensive role templates
    const roleTemplates = [
      // =============================================================================
      // DESIGN ROLES
      // =============================================================================
      {
        id: 'role-product-designer',
        title: 'Product Designer',
        focus: 'Design the entire product experience',
        category: 'Design',
        selectable: true,
        responsibilities: [
          'Product design vision and strategy',
          'Balances usability, aesthetics, and technical feasibility',
          'Performs research and user testing to validate design decisions',
          'Oversees design systems and component libraries for consistency'
        ],
        securityContributions: [
          {
            title: 'Secure by Default Design',
            bullets: [
              'Balance usability and security in product',
              'Prioritise secure by default flows',
              'Highlight insecure configurations and settings to the user'
            ]
          },
          {
            title: 'Security UX Components',
            bullets: [
              'Design consistent tooltips, modals, error messages',
              'Guide users on security best practices',
              'Create intuitive security interfaces'
            ]
          }
        ],
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-ux-designer',
        title: 'User Experience Designer',
        focus: 'Optimises the functionality, flow, and usability of products',
        category: 'Design',
        selectable: true,
        responsibilities: [
          'Conducts user research and usability testing',
          'Defines user journeys and interactions',
          'Ensures designs are intuitive, accessible, and user-centric',
          'Analyses pain-points and behavioural patterns to improve usability'
        ],
        securityContributions: [
          {
            title: 'Security Usability',
            bullets: [
              'Balance usability and security in product',
              'Prioritise secure by default flows',
              'Make security settings, permission prompts, and privacy controls clear'
            ]
          },
          {
            title: 'Security Testing',
            bullets: [
              'Conduct usability testing of security features',
              'Ensure features don\'t frustrate users into bypassing them',
              'Make security features accessible to all users'
            ]
          }
        ],
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-ui-designer',
        title: 'User Interface Designer',
        focus: 'Aesthetically pleasing, consistent, user-friendly interfaces',
        category: 'Design',
        selectable: true,
        responsibilities: [
          'Designs layouts, colors, typography, icons, and components',
          'Ensures design consistency',
          'Optimises UI for different screen sizes and accessibility standards'
        ],
        securityContributions: [
          {
            title: 'Security Visual Design',
            bullets: [
              'Make security actions visually distinct and accessible',
              'Avoid dark patterns in security interfaces',
              'Create secure visual hierarchy for critical security warnings'
            ]
          },
          {
            title: 'Security Iconography',
            bullets: [
              'Design clear security icons and symbols',
              'Create consistent security visual language',
              'Ensure security elements are visually prominent'
            ]
          }
        ],
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // =============================================================================
      // PRODUCT ROLES
      // =============================================================================
      {
        id: 'role-product-manager',
        title: 'Product Manager',
        focus: 'Product strategy and roadmap',
        category: 'Product',
        selectable: true,
        responsibilities: [
          'Defines product vision and strategy',
          'Prioritises features and requirements',
          'Coordinates between engineering, design, and business teams',
          'Analyses market trends and user feedback'
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
            title: 'Security Roadmap',
            bullets: [
              'Plan security features and improvements',
              'Balance security needs with business priorities',
              'Coordinate security compliance requirements',
              'Manage security documentation and policies'
            ]
          }
        ],
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-frontend-developer',
        title: 'Frontend Developer',
        focus: 'Client-side development and user interfaces',
        category: 'Product',
        selectable: true,
        responsibilities: [
          'Builds responsive web interfaces',
          'Implements user interactions and animations',
          'Optimises performance and accessibility',
          'Ensures cross-browser compatibility'
        ],
        securityContributions: [
          {
            title: 'Frontend Security',
            bullets: [
              'Implement secure authentication flows',
              'Prevent XSS and CSRF attacks',
              'Use Content Security Policy',
              'Sanitise user inputs and outputs'
            ]
          },
          {
            title: 'Security Best Practices',
            bullets: [
              'Follow OWASP security guidelines',
              'Use HTTPS for all communications',
              'Implement secure session management',
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
        focus: 'Server-side development and APIs',
        category: 'Product',
        selectable: true,
        responsibilities: [
          'Designs and implements APIs',
          'Manages database operations and data integrity',
          'Ensures system reliability and performance',
          'Implements business logic and data processing'
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

      // =============================================================================
      // QA ROLES
      // =============================================================================
      {
        id: 'role-qa-engineer',
        title: 'QA Engineer',
        focus: 'Quality assurance and testing',
        category: 'QA',
        selectable: true,
        responsibilities: [
          'Designs and executes test plans',
          'Identifies and reports bugs and issues',
          'Ensures product quality and reliability',
          'Collaborates with development teams'
        ],
        securityContributions: [
          {
            title: 'Security Testing',
            bullets: [
              'Conduct security-focused testing',
              'Test authentication and authorization flows',
              'Validate security controls effectiveness',
              'Test incident response procedures'
            ]
          },
          {
            title: 'Security Validation',
            bullets: [
              'Test privacy controls and compliance',
              'Validate secure data handling',
              'Test security incident procedures',
              'Ensure security documentation accuracy'
            ]
          }
        ],
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role-security-qa',
        title: 'Security QA Engineer',
        focus: 'Security testing and validation',
        category: 'QA',
        selectable: true,
        responsibilities: [
          'Conducts security testing and penetration testing',
          'Validates security controls and compliance',
          'Tests incident response procedures',
          'Ensures security requirements are met'
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

      // =============================================================================
      // ARCHITECTURE ROLES
      // =============================================================================
      {
        id: 'role-solution-architect',
        title: 'Solution Architect',
        focus: 'Technical solution design and architecture',
        category: 'Architecture',
        selectable: true,
        responsibilities: [
          'Designs technical solutions and architectures',
          'Ensures scalability and performance',
          'Defines technical standards and patterns',
          'Coordinates between technical teams'
        ],
        securityContributions: [
          {
            title: 'Secure Architecture Design',
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
      {
        id: 'role-security-architect',
        title: 'Security Architect',
        focus: 'Security architecture and design',
        category: 'Architecture',
        selectable: true,
        responsibilities: [
          'Designs security architectures and controls',
          'Defines security patterns and standards',
          'Conducts security assessments and reviews',
          'Ensures compliance with security requirements'
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

      // =============================================================================
      // SOLUTION DESIGN ROLES
      // =============================================================================
      {
        id: 'role-solution-designer',
        title: 'Solution Designer',
        focus: 'Business solution design and implementation',
        category: 'Solution Design',
        selectable: true,
        responsibilities: [
          'Designs business solutions and workflows',
          'Ensures solution meets business requirements',
          'Coordinates implementation and deployment',
          'Provides ongoing solution support'
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

      // =============================================================================
      // SECURITY ROLES
      // =============================================================================
      {
        id: 'role-security-engineer',
        title: 'Security Engineer',
        focus: 'Security infrastructure and controls',
        category: 'Security',
        selectable: true,
        responsibilities: [
          'Designs and implements security controls',
          'Conducts security assessments and monitoring',
          'Responds to security incidents',
          'Develops security policies and procedures'
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
        focus: 'Infrastructure and deployment automation',
        category: 'DevOps',
        selectable: true,
        responsibilities: [
          'Manages infrastructure and deployment pipelines',
          'Automates deployment and monitoring processes',
          'Ensures system reliability and performance',
          'Implements security controls in infrastructure'
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
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Create role templates
    console.log('📝 Creating comprehensive role templates...');
    const createdRoles = await Promise.all(
      roleTemplates.map(async (role) => {
        return await prisma.role_templates.upsert({
          where: {
            id: role.id
          },
          update: {
            title: role.title,
            focus: role.focus,
            category: role.category,
            selectable: role.selectable,
            responsibilities: role.responsibilities,
            securityContributions: role.securityContributions,
            organizationId: role.organizationId,
            updatedAt: new Date()
          },
          create: role
        });
      })
    );

    console.log('✅ Created comprehensive role templates:', createdRoles.length);
    console.log('🎉 Comprehensive role seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding comprehensive roles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedComprehensiveRoles()
  .then(() => {
    console.log('✅ Comprehensive role seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Comprehensive role seeding failed:', error);
    process.exit(1);
  }); 