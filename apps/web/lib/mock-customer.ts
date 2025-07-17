// Mock SaaS Customer: "SecureCorp" - A cybersecurity consulting firm
export const MOCK_CUSTOMER = {
  organization: {
    id: 'org_securecorp_001',
    name: 'SecureCorp',
    description: 'Leading cybersecurity consulting firm specializing in zero-trust architecture',
    domain: 'securecorp.io',
  },

  // Sample DIDs for privacy-preserving assignment
  sampleDids: [
    'did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK',
    'did:web:alice.securecorp.io',
    'did:ion:EiClaZwdDjgyx6yEIb_I2cJqzCE1cX_AEPeQ26vzJAhQeg',
    'did:ethr:0x1234567890123456789012345678901234567890',
    'did:pkh:eip155:1:0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  ],

  // Role templates with security focus
  roleTemplates: [
    {
      id: 'role_sec_eng_001',
      title: 'Security Engineer',
      category: 'Architecture',
      focus: 'Zero-Trust Security',
      responsibilities: [
        'Design and implement zero-trust security architectures',
        'Conduct security assessments and penetration testing',
        'Develop security policies and procedures',
        'Monitor and respond to security incidents',
        'Implement identity and access management solutions'
      ],
      securityContributions: [
        {
          title: 'Security Architecture Design',
          bullets: [
            'Designed zero-trust network architecture reducing attack surface by 85%',
            'Implemented multi-factor authentication across all systems',
            'Created security incident response playbooks'
          ]
        },
        {
          title: 'Threat Detection & Response',
          bullets: [
            'Deployed SIEM solution detecting 200+ security events daily',
            'Reduced mean time to detection from 24 hours to 2 hours',
            'Implemented automated threat hunting capabilities'
          ]
        }
      ]
    },
    {
      id: 'role_frontend_001',
      title: 'Frontend Security Developer',
      category: 'Product',
      focus: 'Secure UI/UX',
      responsibilities: [
        'Build secure, accessible frontend applications',
        'Implement client-side security best practices',
        'Develop secure authentication flows',
        'Create security-focused user interfaces',
        'Ensure compliance with security standards'
      ],
      securityContributions: [
        {
          title: 'Secure Frontend Development',
          bullets: [
            'Implemented Content Security Policy (CSP) headers',
            'Built secure authentication UI with proper input validation',
            'Developed secure session management system'
          ]
        },
        {
          title: 'Security-First UX',
          bullets: [
            'Created security dashboard for real-time threat monitoring',
            'Designed secure password reset flow with rate limiting',
            'Built secure file upload with malware scanning'
          ]
        }
      ]
    },
    {
      id: 'role_backend_001',
      title: 'Backend Security Developer',
      category: 'Product',
      focus: 'Secure APIs',
      responsibilities: [
        'Develop secure REST and GraphQL APIs',
        'Implement proper authentication and authorization',
        'Design secure data storage and encryption',
        'Create secure microservices architecture',
        'Ensure API security compliance'
      ],
      securityContributions: [
        {
          title: 'Secure API Development',
          bullets: [
            'Implemented JWT-based authentication with refresh tokens',
            'Built rate limiting and DDoS protection',
            'Created secure API gateway with request validation'
          ]
        },
        {
          title: 'Data Security',
          bullets: [
            'Implemented end-to-end encryption for sensitive data',
            'Built secure audit logging system',
            'Developed secure data backup and recovery'
          ]
        }
      ]
    },
    {
      id: 'role_devops_001',
      title: 'DevSecOps Engineer',
      category: 'Architecture',
      focus: 'Secure Infrastructure',
      responsibilities: [
        'Implement security in CI/CD pipelines',
        'Manage secure cloud infrastructure',
        'Automate security testing and compliance',
        'Monitor infrastructure security',
        'Implement infrastructure as code security'
      ],
      securityContributions: [
        {
          title: 'Secure CI/CD Pipeline',
          bullets: [
            'Integrated SAST and DAST tools in build pipeline',
            'Implemented automated security scanning for dependencies',
            'Created secure deployment strategies with rollback capabilities'
          ]
        },
        {
          title: 'Infrastructure Security',
          bullets: [
            'Implemented network segmentation and firewall rules',
            'Deployed secure container orchestration with RBAC',
            'Built automated security monitoring and alerting'
          ]
        }
      ]
    },
    {
      id: 'role_qa_001',
      title: 'Security QA Engineer',
      category: 'QA',
      focus: 'Security Testing',
      responsibilities: [
        'Design and execute security test plans',
        'Perform automated security testing',
        'Conduct penetration testing',
        'Validate security requirements',
        'Ensure compliance testing'
      ],
      securityContributions: [
        {
          title: 'Security Testing Automation',
          bullets: [
            'Automated OWASP Top 10 vulnerability scanning',
            'Implemented security regression testing suite',
            'Created security test data management system'
          ]
        },
        {
          title: 'Compliance Validation',
          bullets: [
            'Validated SOC 2 Type II compliance requirements',
            'Ensured GDPR data protection compliance',
            'Verified PCI DSS security controls'
          ]
        }
      ]
    }
  ],

  // Sample digital twins for demonstration - NO PII, only role-based identification
  sampleDigitalTwins: [
    {
      id: 'twin_sec_eng_001',
      roleIdentifier: 'Security Engineer #001',
      description: 'Senior Security Engineer specializing in zero-trust architecture',
      assignedToDid: 'did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK',
      roleTemplateId: 'role_sec_eng_001',
      status: 'active',
      level: 3
    },
    {
      id: 'twin_frontend_001',
      roleIdentifier: 'Frontend Security Developer #001',
      description: 'Frontend Developer focused on secure user interfaces',
      assignedToDid: 'did:web:alice.securecorp.io',
      roleTemplateId: 'role_frontend_001',
      status: 'active',
      level: 2
    },
    {
      id: 'twin_backend_001',
      roleIdentifier: 'Backend Security Developer #001',
      description: 'Backend Developer building secure APIs and microservices',
      assignedToDid: 'did:ion:EiClaZwdDjgyx6yEIb_I2cJqzCE1cX_AEPeQ26vzJAhQeg',
      roleTemplateId: 'role_backend_001',
      status: 'active',
      level: 2
    },
    {
      id: 'twin_devops_001',
      roleIdentifier: 'DevSecOps Engineer #001',
      description: 'DevSecOps Engineer managing secure infrastructure and CI/CD',
      assignedToDid: 'did:ethr:0x1234567890123456789012345678901234567890',
      roleTemplateId: 'role_devops_001',
      status: 'active',
      level: 3
    },
    {
      id: 'twin_qa_001',
      roleIdentifier: 'Security QA Engineer #001',
      description: 'Security QA Engineer performing comprehensive security testing',
      assignedToDid: 'did:pkh:eip155:1:0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      roleTemplateId: 'role_qa_001',
      status: 'active',
      level: 2
    }
  ]
};

// Helper function to get a random DID
export function getRandomDid(): string {
  const dids = MOCK_CUSTOMER.sampleDids;
  return dids[Math.floor(Math.random() * dids.length)];
}

// Helper function to get role template by ID
export function getRoleTemplateById(id: string) {
  return MOCK_CUSTOMER.roleTemplates.find(role => role.id === id);
}

// Helper function to get all role templates
export function getAllRoleTemplates() {
  return MOCK_CUSTOMER.roleTemplates;
} 