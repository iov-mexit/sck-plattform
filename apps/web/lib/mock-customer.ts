// Mock customer data for SecureCorp - a cybersecurity consulting firm
export const mockCustomer = {
  organization: {
    id: 'org-securecorp',
    name: 'SecureCorp',
    description: 'Cybersecurity consulting firm specializing in SaaS security assessments',
    domain: 'securecorp.com',
    industry: 'Cybersecurity',
    size: '50-200 employees',
    isActive: true,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },

  // Role templates for security-focused SaaS consultancy
  roleTemplates: [
    {
      id: 'role-soc-analyst',
      title: 'SOC Analyst',
      category: 'Security',
      focus: 'Security Operations Center monitoring and incident response',
      responsibilities: [
        'Monitor security dashboards and SIEM alerts',
        'Investigate potential security incidents',
        'Perform initial triage and escalation',
        'Document security events and findings',
        'Collaborate with incident response team'
      ],
      securityContributions: [
        'Continuous security monitoring',
        'Threat detection and analysis',
        'Incident documentation',
        'Security alert management'
      ],
      trustThreshold: 70,
      organizationId: 'org-securecorp'
    },
    {
      id: 'role-compliance-officer',
      title: 'Compliance Officer',
      category: 'Compliance',
      focus: 'Regulatory compliance and risk management for client environments',
      responsibilities: [
        'Assess client compliance with SOC 2, ISO 27001, GDPR',
        'Create compliance documentation and reports',
        'Conduct compliance audits and reviews',
        'Advise clients on regulatory requirements',
        'Maintain compliance frameworks and procedures'
      ],
      securityContributions: [
        'Regulatory compliance verification',
        'Risk assessment and mitigation',
        'Compliance documentation',
        'Audit trail maintenance'
      ],
      trustThreshold: 85,
      organizationId: 'org-securecorp'
    },
    {
      id: 'role-penetration-tester',
      title: 'Penetration Tester',
      category: 'Security Testing',
      focus: 'Offensive security testing and vulnerability assessment',
      responsibilities: [
        'Conduct penetration testing engagements',
        'Perform vulnerability assessments',
        'Develop exploitation proofs of concept',
        'Create detailed security testing reports',
        'Provide remediation recommendations'
      ],
      securityContributions: [
        'Vulnerability identification',
        'Security weakness exploitation',
        'Risk quantification',
        'Security improvement recommendations'
      ],
      trustThreshold: 90,
      organizationId: 'org-securecorp'
    },
    {
      id: 'role-security-architect',
      title: 'Security Architect',
      category: 'Architecture',
      focus: 'Design and implementation of security architectures for SaaS clients',
      responsibilities: [
        'Design security architectures for client systems',
        'Review and approve security designs',
        'Provide security guidance to development teams',
        'Evaluate security tools and technologies',
        'Create security standards and guidelines'
      ],
      securityContributions: [
        'Secure architecture design',
        'Security technology evaluation',
        'Security standards development',
        'Risk-based security decisions'
      ],
      trustThreshold: 85,
      organizationId: 'org-securecorp'
    },
    {
      id: 'role-incident-responder',
      title: 'Incident Response Specialist',
      category: 'Incident Response',
      focus: 'Security incident investigation and response coordination',
      responsibilities: [
        'Lead security incident response activities',
        'Coordinate with stakeholders during incidents',
        'Perform digital forensics and evidence collection',
        'Develop incident response procedures',
        'Conduct post-incident reviews and lessons learned'
      ],
      securityContributions: [
        'Incident containment and eradication',
        'Forensic evidence collection',
        'Incident response coordination',
        'Security process improvement'
      ],
      trustThreshold: 80,
      organizationId: 'org-securecorp'
    },
    {
      id: 'role-grc-analyst',
      title: 'GRC Analyst',
      category: 'Governance',
      focus: 'Governance, Risk, and Compliance analysis for enterprise clients',
      responsibilities: [
        'Conduct risk assessments and analysis',
        'Maintain governance frameworks',
        'Monitor compliance with security policies',
        'Generate risk and compliance reports',
        'Support audit and certification activities'
      ],
      securityContributions: [
        'Risk identification and assessment',
        'Compliance monitoring and reporting',
        'Governance framework maintenance',
        'Security metrics and KPIs'
      ],
      trustThreshold: 75,
      organizationId: 'org-securecorp'
    },
    {
      id: 'role-cloud-security-engineer',
      title: 'Cloud Security Engineer',
      category: 'Cloud Security',
      focus: 'Cloud infrastructure security and DevSecOps implementation',
      responsibilities: [
        'Secure cloud infrastructure and services',
        'Implement DevSecOps practices and tools',
        'Configure cloud security monitoring',
        'Perform cloud security assessments',
        'Automate security controls and compliance'
      ],
      securityContributions: [
        'Cloud security implementation',
        'Infrastructure as Code security',
        'Automated security controls',
        'Cloud compliance verification'
      ],
      trustThreshold: 80,
      organizationId: 'org-securecorp'
    },
    {
      id: 'role-privacy-analyst',
      title: 'Privacy Analyst',
      category: 'Privacy',
      focus: 'Data privacy analysis and GDPR/CCPA compliance',
      responsibilities: [
        'Conduct privacy impact assessments',
        'Analyze data flows and privacy risks',
        'Ensure GDPR and CCPA compliance',
        'Develop privacy policies and procedures',
        'Support data subject rights requests'
      ],
      securityContributions: [
        'Privacy risk assessment',
        'Data protection implementation',
        'Privacy compliance verification',
        'Data governance support'
      ],
      trustThreshold: 70,
      organizationId: 'org-securecorp'
    }
  ],

  // Sample role agents for demonstration - NON-DEV roles with DID-only assignment
  roleAgents: [
    {
      id: 'agent-soc-001',
      name: 'SOC Analyst Agent',
      description: 'Level 2 SOC analyst specializing in SIEM monitoring',
      assignedToDid: 'did:ethr:0x742d35Ccdd02392A4fF7a2B4Da71a2f9b2d6c1B1',
      organizationId: 'org-securecorp',
      roleTemplateId: 'role-soc-analyst',
      trustScore: 78,
      isEligibleForMint: true,
      status: 'active',
      level: 2,
      createdAt: '2023-06-15T09:30:00Z',
      updatedAt: '2024-01-15T14:45:00Z'
    },
    {
      id: 'agent-compliance-001',
      name: 'Senior Compliance Officer Agent',
      description: 'Senior compliance officer with SOC 2 and ISO 27001 expertise',
      assignedToDid: 'did:ethr:0x9A8b2C4e5F1d3A7e9C2B5f8A1D4e7B0C3F6A9E2D',
      organizationId: 'org-securecorp',
      roleTemplateId: 'role-compliance-officer',
      trustScore: 92,
      isEligibleForMint: true,
      status: 'active',
      level: 3,
      createdAt: '2023-03-20T11:15:00Z',
      updatedAt: '2024-01-10T16:20:00Z'
    },
    {
      id: 'agent-pentest-001',
      name: 'Senior Penetration Tester Agent',
      description: 'Senior penetration tester with OSCP and advanced certifications',
      assignedToDid: 'did:ethr:0x5E7fC2B8d9F4e1A3b6D8c5E9F2A7b4C6d9E2F5a8',
      organizationId: 'org-securecorp',
      roleTemplateId: 'role-penetration-tester',
      trustScore: 95,
      isEligibleForMint: true,
      status: 'active',
      level: 4,
      createdAt: '2022-11-10T08:00:00Z',
      updatedAt: '2024-01-12T10:30:00Z'
    },
    {
      id: 'agent-architect-001',
      name: 'Principal Security Architect Agent',
      description: 'Principal security architect with enterprise experience',
      assignedToDid: 'did:ethr:0x1B4c7E2f8A5d9C3e6F8b1D4e7A9c2E5f8B1d4E7a',
      organizationId: 'org-securecorp',
      roleTemplateId: 'role-security-architect',
      trustScore: 88,
      isEligibleForMint: true,
      status: 'active',
      level: 4,
      createdAt: '2023-01-25T13:45:00Z',
      updatedAt: '2024-01-08T09:15:00Z'
    },
    {
      id: 'agent-incident-001',
      name: 'Lead Incident Response Specialist Agent',
      description: 'Lead incident response specialist with GCIH certification',
      assignedToDid: 'did:ethr:0x8D2e5F1c4B7a0E3f6C9d2E5f8A1b4D7e0C3f6B9e',
      organizationId: 'org-securecorp',
      roleTemplateId: 'role-incident-responder',
      trustScore: 85,
      isEligibleForMint: true,
      status: 'active',
      level: 3,
      createdAt: '2023-04-12T10:20:00Z',
      updatedAt: '2024-01-14T12:00:00Z'
    }
  ],

  // Trust signals for role agent demonstration
  signals: [
    {
      id: 'signal-001',
      type: 'certification',
      title: 'CISSP Certification Achieved',
      description: 'Successfully obtained Certified Information Systems Security Professional certification',
      value: 25,
      source: '(ISC)² Official Certification',
      url: 'https://www.isc2.org/Certifications/CISSP',
      verified: true,
      roleAgentId: 'agent-compliance-001',
      createdAt: '2023-08-15T14:30:00Z'
    },
    {
      id: 'signal-002',
      type: 'certification',
      title: 'OSCP Certification Earned',
      description: 'Completed Offensive Security Certified Professional certification',
      value: 30,
      source: 'Offensive Security',
      url: 'https://www.offensive-security.com/pwk-oscp/',
      verified: true,
      roleAgentId: 'agent-pentest-001',
      createdAt: '2023-09-22T16:45:00Z'
    },
    {
      id: 'signal-003',
      type: 'achievement',
      title: 'Led Major Incident Response',
      description: 'Successfully led response to critical security incident, minimizing impact',
      value: 20,
      source: 'SecureCorp Internal Assessment',
      verified: true,
      roleAgentId: 'agent-incident-001',
      createdAt: '2023-11-08T11:20:00Z'
    },
    {
      id: 'signal-004',
      type: 'certification',
      title: 'GCIH Certification Completed',
      description: 'GIAC Certified Incident Handler certification achieved',
      value: 22,
      source: 'SANS Institute',
      url: 'https://www.giac.org/certifications/certified-incident-handler-gcih/',
      verified: true,
      roleAgentId: 'agent-incident-001',
      createdAt: '2023-10-14T09:15:00Z'
    },
    {
      id: 'signal-005',
      type: 'achievement',
      title: 'SOC 2 Type II Audit Lead',
      description: 'Led successful SOC 2 Type II audit for major enterprise client',
      value: 18,
      source: 'Client Audit Results',
      verified: true,
      roleAgentId: 'agent-compliance-001',
      createdAt: '2023-12-05T15:30:00Z'
    }
  ],

  // Certifications for role agent validation
  certifications: [
    {
      id: 'cert-001',
      type: 'CISSP',
      name: 'Certified Information Systems Security Professional',
      issuer: '(ISC)²',
      issuedAt: '2023-08-15T00:00:00Z',
      expiresAt: '2026-08-15T00:00:00Z',
      credentialUrl: 'https://www.credly.com/badges/sample-cissp-badge',
      verified: true,
      roleAgentId: 'agent-compliance-001',
      createdAt: '2023-08-15T14:30:00Z'
    },
    {
      id: 'cert-002',
      type: 'OSCP',
      name: 'Offensive Security Certified Professional',
      issuer: 'Offensive Security',
      issuedAt: '2023-09-22T00:00:00Z',
      expiresAt: '2025-09-22T00:00:00Z',
      credentialUrl: 'https://www.credly.com/badges/sample-oscp-badge',
      verified: true,
      roleAgentId: 'agent-pentest-001',
      createdAt: '2023-09-22T16:45:00Z'
    },
    {
      id: 'cert-003',
      type: 'GCIH',
      name: 'GIAC Certified Incident Handler',
      issuer: 'SANS Institute',
      issuedAt: '2023-10-14T00:00:00Z',
      expiresAt: '2027-10-14T00:00:00Z',
      credentialUrl: 'https://www.credly.com/badges/sample-gcih-badge',
      verified: true,
      roleAgentId: 'agent-incident-001',
      createdAt: '2023-10-14T09:15:00Z'
    }
  ]
};

export default mockCustomer; 