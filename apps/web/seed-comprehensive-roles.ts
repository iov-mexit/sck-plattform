import { PrismaClient } from '../../node_modules/@prisma/client';

const prisma = new PrismaClient();

async function seedComprehensiveRoles() {
  console.log('🌱 Seeding comprehensive role templates...');

  try {
    // Find the organization
    const organization = await prisma.organization.findUnique({
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
        ]
      },
      {
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
        ]
      },
      {
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
            title: 'Security UX Patterns',
            bullets: [
              'Prioritise critical security warnings in ways users won\'t ignore',
              'Design clear security state indicators',
              'Create intuitive security feedback mechanisms'
            ]
          }
        ]
      },

      // =============================================================================
      // DEVELOPER ROLES
      // =============================================================================
      {
        title: 'Backend Developer',
        focus: 'Building and maintaining the server-side logic, databases, and APIs',
        category: 'Development',
        selectable: true,
        responsibilities: [
          'Designs, develops, and maintains server-side applications',
          'Manages databases and ensures data integrity',
          'Develops and consumes APIs (RESTful, GraphQL)',
          'Implements authentication and authorization mechanisms',
          'Manages server infrastructure and deployment'
        ],
        securityContributions: [
          {
            title: 'Secure Coding Practices',
            bullets: [
              'Implement secure coding practices to prevent OWASP Top 10 vulnerabilities',
              'Validate and sanitize all inputs to prevent injection attacks',
              'Securely manage sensitive data with proper encryption'
            ]
          },
          {
            title: 'Authentication & Authorization',
            bullets: [
              'Implement robust authentication and authorization controls',
              'Secure API endpoints with rate limiting and input validation',
              'Apply security best practices for database interactions'
            ]
          },
          {
            title: 'Security Monitoring',
            bullets: [
              'Implement secure logging and monitoring for suspicious activities',
              'Integrate security libraries and frameworks',
              'Ensure secure session management'
            ]
          }
        ]
      },
      {
        title: 'Mobile Developer',
        focus: 'Developing applications for mobile operating systems',
        category: 'Development',
        selectable: true,
        responsibilities: [
          'Designs and builds native or cross-platform mobile applications',
          'Integrates with backend APIs and cloud services',
          'Manages UI/UX for mobile form factors and gestures',
          'Optimises app performance and battery usage',
          'Publishes and maintains apps on app stores'
        ],
        securityContributions: [
          {
            title: 'Mobile Security',
            bullets: [
              'Implement secure data storage on devices (Keychain, Android Keystore)',
              'Secure communication with backend APIs (HTTPS, certificate pinning)',
              'Protect against common mobile vulnerabilities'
            ]
          },
          {
            title: 'Code Protection',
            bullets: [
              'Obfuscate code and apply anti-tampering techniques',
              'Ensure third-party libraries and SDKs are secure',
              'Adhere to platform-specific security guidelines'
            ]
          },
          {
            title: 'User Data Protection',
            bullets: [
              'Handle sensitive user input securely',
              'Prevent keyboard caching and screenshot prevention',
              'Implement robust authentication within the app'
            ]
          }
        ]
      },
      {
        title: 'Web Developer (Frontend)',
        focus: 'Building and maintaining the user-facing part of websites and web applications',
        category: 'Development',
        selectable: true,
        responsibilities: [
          'Develops user interfaces using HTML, CSS, and JavaScript',
          'Implements client-side logic and interacts with backend APIs',
          'Ensures cross-browser compatibility and responsive design',
          'Optimises web performance and load times',
          'Manages frontend build processes and dependencies'
        ],
        securityContributions: [
          {
            title: 'Client-Side Security',
            bullets: [
              'Implement secure coding practices to prevent XSS, CSRF, DOM-based attacks',
              'Properly escape and sanitize all user-generated content',
              'Implement Content Security Policy (CSP) to mitigate attacks'
            ]
          },
          {
            title: 'Session & Cookie Security',
            bullets: [
              'Securely handle user sessions and cookies',
              'Protect against Cross-Site Request Forgery (CSRF)',
              'Validate and sanitize all data before sending to backend'
            ]
          },
          {
            title: 'Third-Party Security',
            bullets: [
              'Manage third-party scripts and libraries securely',
              'Ensure secure storage of sensitive data in browser',
              'Implement secure authentication flows'
            ]
          }
        ]
      },
      {
        title: 'Full Stack Developer',
        focus: 'Developing both the frontend and backend of applications',
        category: 'Development',
        selectable: true,
        responsibilities: [
          'Possesses expertise in both frontend and backend technologies',
          'Manages the entire web development lifecycle',
          'Collaborates closely with design, QA, and operations teams',
          'Understands how different layers of an application interact'
        ],
        securityContributions: [
          {
            title: 'End-to-End Security',
            bullets: [
              'Apply secure coding principles across the entire stack',
              'Ensure consistent input validation and sanitization at all layers',
              'Implement end-to-end secure data flow'
            ]
          },
          {
            title: 'Multi-Layer Security',
            bullets: [
              'Understand and mitigate vulnerabilities that span multiple layers',
              'Coordinate secure API design between frontend and backend',
              'Manage dependencies securely across the full stack'
            ]
          },
          {
            title: 'Security Monitoring',
            bullets: [
              'Implement comprehensive logging and monitoring',
              'Ensure proper configuration of web servers and databases',
              'Coordinate security events across all layers'
            ]
          }
        ]
      },
      {
        title: 'Blockchain Developer',
        focus: 'Designing, developing, and deploying decentralized applications and smart contracts',
        category: 'Development',
        selectable: true,
        responsibilities: [
          'Develops smart contracts for blockchain networks',
          'Builds dApps that interact with smart contracts',
          'Designs and implements blockchain architectures',
          'Works with cryptographic principles and decentralized protocols',
          'Manages blockchain nodes and infrastructure'
        ],
        securityContributions: [
          {
            title: 'Smart Contract Security',
            bullets: [
              'Write secure and audited smart contracts',
              'Prevent common vulnerabilities (reentrancy, integer overflow)',
              'Apply best practices for token standards securely'
            ]
          },
          {
            title: 'Cryptographic Security',
            bullets: [
              'Protect private keys and sensitive cryptographic material',
              'Ensure secure communication with blockchain nodes',
              'Understand blockchain immutability implications'
            ]
          },
          {
            title: 'dApp Security',
            bullets: [
              'Conduct thorough security audits and formal verification',
              'Implement secure frontends for dApps',
              'Stay updated on emerging blockchain security threats'
            ]
          }
        ]
      },

      // =============================================================================
      // QA AUTOMATION ROLES
      // =============================================================================
      {
        title: 'Test Automation Engineer',
        focus: 'Automating repetitive functional tests to improve efficiency and reliability',
        category: 'Quality Assurance',
        selectable: true,
        responsibilities: [
          'Creates and maintains automated test suites',
          'Integrates automated tests into the CI/CD pipeline',
          'Ensures core features continue to work correctly across updates',
          'Helps detects regressions early, improving development speed'
        ],
        securityContributions: [
          {
            title: 'Security Test Automation',
            bullets: [
              'Automate security regression tests for authentication flows',
              'Incorporate challenge testing to prevent SQL injection, XSS',
              'Integrate security scanning tools into CI/CD pipelines'
            ]
          },
          {
            title: 'Security Validation',
            bullets: [
              'Ensure critical access control flows are regularly tested',
              'Catch vulnerabilities early in development process',
              'Maintain security test coverage across updates'
            ]
          }
        ]
      },
      {
        title: 'Performance Test Engineer',
        focus: 'Validating system performance under load, stress, and scalability conditions',
        category: 'Quality Assurance',
        selectable: true,
        responsibilities: [
          'Conducts load, stress, endurance, and spike testing',
          'Identifies bottlenecks, simulating real-world traffic',
          'Optimises infrastructure and application performance',
          'Ensures applications meet SLAs for response time and concurrency'
        ],
        securityContributions: [
          {
            title: 'DoS Protection Testing',
            bullets: [
              'Identify performance issues that could expose DoS weaknesses',
              'Verify session expiration and rate limiting under high loads',
              'Test system resilience against performance-based attacks'
            ]
          },
          {
            title: 'Security Performance',
            bullets: [
              'Ensure security mechanisms don\'t degrade performance',
              'Test security features under load conditions',
              'Validate rate limiting effectiveness'
            ]
          }
        ]
      },
      {
        title: 'Security Test Engineer',
        focus: 'Identifying security vulnerabilities and weaknesses before attackers do',
        category: 'Quality Assurance',
        selectable: true,
        responsibilities: [
          'Integrates automated security testing and scanning into the pipeline',
          'Conducts targeted penetration testing and vulnerability assessments',
          'Focused on code security over network security'
        ],
        securityContributions: [
          {
            title: 'Security Testing',
            bullets: [
              'Conduct automated and manual security reviews',
              'Test security-critical functionality (MFA, SSO, session timeouts)',
              'Enforce security scans and dependency checks in CI/CD'
            ]
          },
          {
            title: 'Vulnerability Assessment',
            bullets: [
              'Identify security gaps in applications',
              'Validate security controls effectiveness',
              'Ensure compliance with security standards'
            ]
          }
        ]
      },

      // =============================================================================
      // QA MANUAL TESTING ROLES
      // =============================================================================
      {
        title: 'QA Analyst',
        focus: 'Defining quality standards, test plans, and testing strategy',
        category: 'Quality Assurance',
        selectable: true,
        responsibilities: [
          'Defines test plans, cases, scripts, and acceptance criteria',
          'Analyses defect trends and test coverage gaps',
          'Ensure testing meets regulatory and compliance standards'
        ],
        securityContributions: [
          {
            title: 'Security Test Planning',
            bullets: [
              'Incorporate security testing into test plans and acceptance criteria',
              'Ensure cases cover authentication, authorization, and data protection',
              'Work with security teams to align testing with security standards'
            ]
          },
          {
            title: 'Security Defect Management',
            bullets: [
              'Balance prioritising security defects with functional defects',
              'Define security testing standards and procedures',
              'Ensure comprehensive security test coverage'
            ]
          }
        ]
      },
      {
        title: 'QA Tester',
        focus: 'Manually executing test cases to find functional defects',
        category: 'Quality Assurance',
        selectable: true,
        responsibilities: [
          'Performs manual functional, regression, and exploratory testing',
          'Logs detailed, reproducible bug reports',
          'Validates UI/UX consistency, edge cases, and business logic',
          'Works with defined test plans and scripts to ensure coverage'
        ],
        securityContributions: [
          {
            title: 'Security Testing',
            bullets: [
              'Report insecure UI behaviour and sensitive data exposure',
              'Robust challenge testing for input validation',
              'Check for role-based access control inconsistencies'
            ]
          },
          {
            title: 'Security Validation',
            bullets: [
              'Verify session handling expectations',
              'Flag misconfigurations and weak default settings',
              'Test security features from user perspective'
            ]
          }
        ]
      },
      {
        title: 'UAT Tester',
        focus: 'Ensuring the product meets business and end-user expectations',
        category: 'Quality Assurance',
        selectable: true,
        responsibilities: [
          'Tests real-world scenarios and validates user requirements',
          'Ensures new features meet stakeholder expectations before release',
          'Reports usability and functionality gaps from an end-user perspective'
        ],
        securityContributions: [
          {
            title: 'Security UX Testing',
            bullets: [
              'Ensure security features do not frustrate users',
              'Highlight missed secure by default configuration opportunities',
              'Identify confusing or unclear security flows'
            ]
          },
          {
            title: 'User Security Validation',
            bullets: [
              'Test security features from business user perspective',
              'Validate security workflows meet business requirements',
              'Ensure security doesn\'t impede business processes'
            ]
          }
        ]
      },
      {
        title: 'Release QA Engineer',
        focus: 'Ensuring the stability and reliability of final production releases',
        category: 'Quality Assurance',
        selectable: true,
        responsibilities: [
          'Conducts smoke tests, sanity tests, and regression tests before deployment',
          'Validated code changes don\'t break existing functionality',
          'Ensures release artifacts meet security, compliance, and performance standards',
          'Approves or blocks release based on final quality checks'
        ],
        securityContributions: [
          {
            title: 'Release Security',
            bullets: [
              'Conducts final security smoke tests to catch last-minute vulnerabilities',
              'Ensure no sensitive data is exposed in production',
              'Confirms patches and security fixes are included in releases'
            ]
          },
          {
            title: 'Security Validation',
            bullets: [
              'Run sanity tests for security-critical features',
              'Validate authentication, access control, and encryption',
              'Ensure security compliance before release approval'
            ]
          }
        ]
      }
    ];

    // Create role templates
    const createdRoles = await Promise.all(
      roleTemplates.map(async (role) => {
        return await prisma.roleTemplate.upsert({
          where: {
            id: role.title.toLowerCase().replace(/\s+/g, '-'),
          },
          update: {
            title: role.title,
            focus: role.focus,
            category: role.category,
            selectable: role.selectable,
            responsibilities: role.responsibilities,
            securityContributions: role.securityContributions,
            updatedAt: new Date(),
          },
          create: {
            id: role.title.toLowerCase().replace(/\s+/g, '-'),
            title: role.title,
            focus: role.focus,
            category: role.category,
            selectable: role.selectable,
            responsibilities: role.responsibilities,
            securityContributions: role.securityContributions,
          },
        });
      })
    );

    console.log('✅ Created comprehensive role templates:', createdRoles.length);
    console.log('');
    console.log('Role Categories:');
    const categories = [...new Set(createdRoles.map(role => role.category))];
    categories.forEach(category => {
      const roles = createdRoles.filter(role => role.category === category);
      console.log(`  ${category} (${roles.length} roles):`);
      roles.forEach(role => {
        console.log(`    - ${role.title}`);
      });
    });

  } catch (error) {
    console.error('❌ Error seeding comprehensive roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedComprehensiveRoles(); 