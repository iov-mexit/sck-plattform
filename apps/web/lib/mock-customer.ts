// Mock SaaS Customer: "SecureCorp" - A cybersecurity consulting firm
export const MOCK_CUSTOMER = {
  organization: {
    id: 'org_securecorp_001',
    name: 'SecureCorp',
    description: 'Leading cybersecurity consulting firm specializing in zero-trust architecture',
    domain: 'securecorp.io',
    // Organization structure definition
    departments: [
      {
        id: 'dept_security_ops',
        name: 'Security Operations',
        description: '24/7 security monitoring and incident response',
        level: 1
      },
      {
        id: 'dept_compliance',
        name: 'Compliance & Governance',
        description: 'Regulatory compliance and risk management',
        level: 1
      },
      {
        id: 'dept_consulting',
        name: 'Security Consulting',
        description: 'Client advisory and security assessments',
        level: 1
      },
      {
        id: 'dept_engineering',
        name: 'Security Engineering',
        description: 'Security tool development and infrastructure',
        level: 2
      }
    ]
  },

  // Sample DIDs for privacy-preserving assignment
  sampleDids: [
    'did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK',
    'did:web:alice.securecorp.io',
    'did:ion:EiClaZwdDjgyx6yEIb_I2cJqzCE1cX_AEPeQ26vzJAhQeg',
    'did:ethr:0x1234567890123456789012345678901234567890',
    'did:pkh:eip155:1:0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  ],

  // Security-aware NON-DEV role templates for SaaS clients
  roleTemplates: [
    // Security Operations Roles
    {
      id: 'role_soc_analyst',
      title: 'SOC Analyst',
      category: 'Security Operations',
      department: 'Security Operations',
      focus: 'Threat Detection & Response',
      responsibilities: [
        'Monitor security alerts and investigate incidents',
        'Analyze threat intelligence and security events',
        'Respond to security incidents and coordinate remediation',
        'Maintain security monitoring tools and dashboards',
        'Document incident response procedures and lessons learned'
      ],
      securityContributions: [
        {
          title: 'Incident Response',
          bullets: [
            'Responded to 50+ security incidents with 100% resolution rate',
            'Reduced mean time to detection from 4 hours to 30 minutes',
            'Implemented automated threat hunting capabilities'
          ]
        },
        {
          title: 'Threat Intelligence',
          bullets: [
            'Analyzed 200+ threat indicators daily',
            'Created threat intelligence reports for executive leadership',
            'Integrated threat feeds into SIEM platform'
          ]
        }
      ]
    },
    {
      id: 'role_soc_manager',
      title: 'SOC Manager',
      category: 'Security Operations',
      department: 'Security Operations',
      focus: 'Security Operations Leadership',
      responsibilities: [
        'Lead and manage SOC team operations',
        'Develop and implement security policies and procedures',
        'Coordinate with incident response teams',
        'Manage security tooling and technology stack',
        'Report to executive leadership on security posture'
      ],
      securityContributions: [
        {
          title: 'Team Leadership',
          bullets: [
            'Managed 12-person SOC team across 3 shifts',
            'Reduced security incident response time by 60%',
            'Implemented 24/7 security monitoring program'
          ]
        },
        {
          title: 'Process Improvement',
          bullets: [
            'Developed incident response playbooks for 15 threat scenarios',
            'Created security metrics dashboard for executive reporting',
            'Established security operations center procedures'
          ]
        }
      ]
    },

    // Compliance & Governance Roles
    {
      id: 'role_compliance_officer',
      title: 'Compliance Officer',
      category: 'Compliance & Governance',
      department: 'Compliance & Governance',
      focus: 'Regulatory Compliance',
      responsibilities: [
        'Ensure compliance with security regulations and standards',
        'Develop and maintain security policies and procedures',
        'Conduct compliance audits and assessments',
        'Manage vendor security assessments',
        'Coordinate with legal and risk management teams'
      ],
      securityContributions: [
        {
          title: 'Compliance Management',
          bullets: [
            'Achieved SOC 2 Type II compliance in 6 months',
            'Developed 25+ security policies and procedures',
            'Conducted 50+ vendor security assessments'
          ]
        },
        {
          title: 'Risk Management',
          bullets: [
            'Reduced compliance audit findings by 80%',
            'Implemented GRC platform for automated compliance',
            'Established security awareness training program'
          ]
        }
      ]
    },
    {
      id: 'role_privacy_officer',
      title: 'Privacy Officer',
      category: 'Compliance & Governance',
      department: 'Compliance & Governance',
      focus: 'Data Privacy & Protection',
      responsibilities: [
        'Develop and implement privacy policies and procedures',
        'Ensure GDPR and other privacy regulation compliance',
        'Conduct privacy impact assessments',
        'Manage data subject rights and requests',
        'Coordinate with legal and security teams on privacy matters'
      ],
      securityContributions: [
        {
          title: 'Privacy Program',
          bullets: [
            'Implemented GDPR compliance program across organization',
            'Reduced data breach risk by 70% through privacy controls',
            'Established data protection impact assessment process'
          ]
        },
        {
          title: 'Data Governance',
          bullets: [
            'Created data classification and handling procedures',
            'Implemented privacy-by-design principles in new projects',
            'Developed data retention and disposal policies'
          ]
        }
      ]
    },

    // Security Consulting Roles
    {
      id: 'role_security_consultant',
      title: 'Security Consultant',
      category: 'Security Consulting',
      department: 'Security Consulting',
      focus: 'Client Security Advisory',
      responsibilities: [
        'Conduct security assessments for clients',
        'Develop security strategies and roadmaps',
        'Provide security advisory services',
        'Deliver security training and awareness programs',
        'Create security documentation and reports'
      ],
      securityContributions: [
        {
          title: 'Client Advisory',
          bullets: [
            'Conducted 30+ security assessments for Fortune 500 clients',
            'Developed security roadmaps for 15 organizations',
            'Reduced client security incidents by 65% on average'
          ]
        },
        {
          title: 'Security Strategy',
          bullets: [
            'Created zero-trust architecture implementations',
            'Developed incident response programs for 20+ clients',
            'Established security governance frameworks'
          ]
        }
      ]
    },
    {
      id: 'role_risk_analyst',
      title: 'Risk Analyst',
      category: 'Security Consulting',
      department: 'Security Consulting',
      focus: 'Security Risk Assessment',
      responsibilities: [
        'Conduct security risk assessments and analysis',
        'Develop risk mitigation strategies',
        'Create security risk reports and presentations',
        'Coordinate with clients on risk management',
        'Monitor and track security risk metrics'
      ],
      securityContributions: [
        {
          title: 'Risk Assessment',
          bullets: [
            'Conducted 40+ security risk assessments',
            'Identified $2M+ in potential security cost savings',
            'Developed risk scoring methodology for clients'
          ]
        },
        {
          title: 'Risk Mitigation',
          bullets: [
            'Created risk mitigation strategies for 25+ organizations',
            'Reduced client security risk scores by 45% on average',
            'Established continuous risk monitoring programs'
          ]
        }
      ]
    },

    // Security Engineering Roles (Non-Dev Focus)
    {
      id: 'role_security_architect',
      title: 'Security Architect',
      category: 'Security Engineering',
      department: 'Security Engineering',
      focus: 'Security Architecture Design',
      responsibilities: [
        'Design security architectures and frameworks',
        'Evaluate and select security technologies',
        'Develop security standards and guidelines',
        'Provide technical security guidance',
        'Review and approve security designs'
      ],
      securityContributions: [
        {
          title: 'Architecture Design',
          bullets: [
            'Designed zero-trust architecture for 10+ organizations',
            'Reduced attack surface by 75% through architectural controls',
            'Created security reference architectures'
          ]
        },
        {
          title: 'Technology Selection',
          bullets: [
            'Evaluated and selected security tools for 15+ projects',
            'Reduced security tool costs by 40% through consolidation',
            'Implemented security technology roadmaps'
          ]
        }
      ]
    },
    {
      id: 'role_penetration_tester',
      title: 'Penetration Tester',
      category: 'Security Engineering',
      department: 'Security Engineering',
      focus: 'Security Testing & Assessment',
      responsibilities: [
        'Conduct penetration testing and vulnerability assessments',
        'Perform security code reviews and architecture reviews',
        'Develop security testing methodologies',
        'Create detailed security assessment reports',
        'Provide remediation guidance and recommendations'
      ],
      securityContributions: [
        {
          title: 'Security Testing',
          bullets: [
            'Conducted 100+ penetration tests across various industries',
            'Identified 500+ critical security vulnerabilities',
            'Developed automated security testing frameworks'
          ]
        },
        {
          title: 'Vulnerability Management',
          bullets: [
            'Reduced client vulnerability exposure by 80%',
            'Created vulnerability assessment methodologies',
            'Established continuous security testing programs'
          ]
        }
      ]
    }
  ],

  // Sample digital twins for demonstration - NON-DEV roles with DID-only assignment
  sampleDigitalTwins: [
    {
      id: 'twin_soc_analyst_001',
      roleIdentifier: 'SOC Analyst #001',
      description: 'Senior SOC Analyst specializing in threat detection and incident response',
      assignedToDid: 'did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK',
      roleTemplateId: 'role_soc_analyst',
      department: 'Security Operations',
      status: 'active',
      level: 3
      // DID is the human assignment - organization can resolve DID to employee
      // Platform remains "blind" to PII
    },
    {
      id: 'twin_compliance_officer_001',
      roleIdentifier: 'Compliance Officer #001',
      description: 'Compliance Officer managing regulatory requirements and audits',
      assignedToDid: 'did:web:alice.securecorp.io',
      roleTemplateId: 'role_compliance_officer',
      department: 'Compliance & Governance',
      status: 'active',
      level: 2
      // DID is the human assignment - organization can resolve DID to employee
      // Platform remains "blind" to PII
    },
    {
      id: 'twin_security_consultant_001',
      roleIdentifier: 'Security Consultant #001',
      description: 'Senior Security Consultant providing client advisory services',
      assignedToDid: 'did:ion:EiClaZwdDjgyx6yEIb_I2cJqzCE1cX_AEPeQ26vzJAhQeg',
      roleTemplateId: 'role_security_consultant',
      department: 'Security Consulting',
      status: 'active',
      level: 4
      // DID is the human assignment - organization can resolve DID to employee
      // Platform remains "blind" to PII
    }
  ],

  // Signal collection examples for non-dev roles
  signalExamples: [
    {
      type: 'certification',
      title: 'CISSP Certification',
      description: 'Certified Information Systems Security Professional',
      value: 100,
      source: 'ISC²',
      verified: true
    },
    {
      type: 'activity',
      title: 'Incident Response',
      description: 'Responded to 15 security incidents this month',
      value: 75,
      source: 'SIEM Platform',
      verified: true
    },
    {
      type: 'achievement',
      title: 'SOC 2 Compliance',
      description: 'Led organization to SOC 2 Type II compliance',
      value: 90,
      source: 'Audit Report',
      verified: true
    }
  ]
};

// Helper functions
export function getRandomDid(): string {
  const dids = MOCK_CUSTOMER.sampleDids;
  return dids[Math.floor(Math.random() * dids.length)];
}

export function getRoleTemplateById(id: string) {
  return MOCK_CUSTOMER.roleTemplates.find(template => template.id === id);
}

export function getAllRoleTemplates() {
  return MOCK_CUSTOMER.roleTemplates;
}

export function getDepartments() {
  return MOCK_CUSTOMER.organization.departments;
}

export function getDigitalTwinsByDepartment(departmentId: string) {
  return MOCK_CUSTOMER.sampleDigitalTwins.filter(twin => twin.department === departmentId);
} 