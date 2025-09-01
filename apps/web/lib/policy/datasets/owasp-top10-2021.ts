// OWASP Top 10 2021 Dataset
// Plug-and-play regulatory dataset for the new architecture

import { RegulatoryRequirement } from '../regulatory-core';

export const OWASP_TOP_10_2021: RegulatoryRequirement[] = [
  {
    id: 'owasp-a01-2021',
    frameworkId: 'owasp-top10-2021',
    title: 'A01:2021 - Broken Access Control',
    description: 'Broken Access Control moves up from the fifth position; 94% of applications were tested for some form of broken access control. The 34 Common Weakness Enumerations (CWEs) mapped to Broken Access Control had more occurrences in applications than any other category.',
    citation: 'A01:2021',
    content: 'Access control enforces policy such that users cannot act outside of their intended permissions. Failures typically lead to unauthorized information disclosure, modification, or destruction of all data or performing a business function outside the user\'s limits.',
    impact: 'HIGH',
    category: 'Access Control',
    requirements: [
      'Implement role-based access control (RBAC)',
      'Enforce principle of least privilege',
      'Implement secure session management',
      'Validate user permissions on all requests',
      'Implement secure API access controls'
    ],
    implementation: [
      'Use OAuth 2.0/OpenID Connect for authentication',
      'Implement JWT token validation with proper expiration',
      'Design microservice access controls with service mesh',
      'Regular security code reviews focusing on access control',
      'Automated testing for privilege escalation scenarios'
    ],
    compliance: [
      'Quarterly access control assessments using OWASP testing guide',
      'Annual penetration testing with focus on authorization bypass',
      'Regular audit of user permissions and role assignments',
      'Performance metrics for access control effectiveness'
    ],
    confidence: 1.0, // Official OWASP source
    source: 'OWASP Top 10 2021 - Official Documentation',
    sourceUrl: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/',
    lastUpdated: new Date('2021-01-01'),
    crossReferences: [
      'gdpr-2016:article-32', // GDPR Article 32 - Security of Processing
      'nis2-2023:incident-response', // NIS2 Incident Response
      'iso-27001:2022:control-8.1' // ISO 27001 Access Control
    ],
    knowledgeChunks: [
      {
        id: 'owasp-a01-desc',
        text: 'Access control enforces policy such that users cannot act outside of their intended permissions. Failures typically lead to unauthorized information disclosure, modification, or destruction of all data or performing a business function outside the user\'s limits.',
        embedding: undefined
      },
      {
        id: 'owasp-a01-req',
        text: 'Implement role-based access control (RBAC), enforce principle of least privilege, implement secure session management, validate user permissions on all requests, implement secure API access controls',
        embedding: undefined
      }
    ]
  },
  {
    id: 'owasp-a02-2021',
    frameworkId: 'owasp-top10-2021',
    title: 'A02:2021 - Cryptographic Failures',
    description: 'Cryptographic Failures shifts up one position to #2, previously known as Sensitive Data Exposure, which was broad symptom rather than a root cause. The renewed focus here is on failures related to cryptography which often leads to sensitive data exposure or system compromise.',
    citation: 'A02:2021',
    content: 'Cryptographic failures can lead to data exposure and system compromise, particularly in data transmission and storage. This includes weak encryption algorithms, improper key management, and insecure communication protocols.',
    impact: 'HIGH',
    category: 'Cryptography',
    requirements: [
      'Implement strong encryption algorithms (AES-256, RSA-4096)',
      'Use TLS 1.3 for all data in transit',
      'Implement secure key management and rotation',
      'Use cryptographic libraries that are regularly updated',
      'Implement secure random number generation'
    ],
    implementation: [
      'Use industry-standard cryptographic libraries (OpenSSL, BouncyCastle)',
      'Implement automated certificate rotation and key management',
      'Regular security assessments of cryptographic implementations',
      'Automated testing for common cryptographic vulnerabilities',
      'Compliance with FIPS 140-2 standards where applicable'
    ],
    compliance: [
      'Regular cryptographic security assessments',
      'Automated certificate and key rotation',
      'Compliance with industry encryption standards',
      'Regular penetration testing of cryptographic implementations'
    ],
    confidence: 1.0, // Official OWASP source
    source: 'OWASP Top 10 2021 - Official Documentation',
    sourceUrl: 'https://owasp.org/Top10/A02_2021-Cryptographic_Failures/',
    lastUpdated: new Date('2021-01-01'),
    crossReferences: [
      'gdpr-2016:article-32', // GDPR Article 32 - Security of Processing
      'pci-dss:4.1', // PCI DSS Requirement 4.1 - Strong Cryptography
      'iso-27001:2022:control-10.1' // ISO 27001 Cryptographic Controls
    ],
    knowledgeChunks: [
      {
        id: 'owasp-a02-desc',
        text: 'Cryptographic failures can lead to data exposure and system compromise, particularly in data transmission and storage. This includes weak encryption algorithms, improper key management, and insecure communication protocols.',
        embedding: undefined
      },
      {
        id: 'owasp-a02-req',
        text: 'Implement strong encryption algorithms (AES-256, RSA-4096), use TLS 1.3 for all data in transit, implement secure key management and rotation, use cryptographic libraries that are regularly updated, implement secure random number generation',
        embedding: undefined
      }
    ]
  },
  {
    id: 'owasp-a03-2021',
    frameworkId: 'owasp-top10-2021',
    title: 'A03:2021 - Injection',
    description: 'Injection flaws, such as SQL, NoSQL, OS, and LDAP injection, occur when untrusted data is sent to an interpreter as part of a command or query. The attacker\'s hostile data can trick the interpreter into executing unintended commands or accessing data without proper authorization.',
    citation: 'A03:2021',
    content: 'Injection vulnerabilities allow attackers to execute malicious code or commands through application inputs. This includes SQL injection, NoSQL injection, command injection, and other interpreter-based attacks.',
    impact: 'HIGH',
    category: 'Input Validation',
    requirements: [
      'Validate and sanitize all user inputs',
      'Use parameterized queries and prepared statements',
      'Implement input validation and output encoding',
      'Use safe APIs and frameworks',
      'Implement proper error handling without information disclosure'
    ],
    implementation: [
      'Use parameterized queries for all database operations',
      'Implement input validation using allowlist approach',
      'Use output encoding for all dynamic content',
      'Regular security testing for injection vulnerabilities',
      'Automated scanning in CI/CD pipelines'
    ],
    compliance: [
      'Regular injection vulnerability testing',
      'Code review focusing on input validation',
      'Automated security scanning in development',
      'Penetration testing for injection attacks'
    ],
    confidence: 1.0, // Official OWASP source
    source: 'OWASP Top 10 2021 - Official Documentation',
    sourceUrl: 'https://owasp.org/Top10/A03_2021-Injection/',
    lastUpdated: new Date('2021-01-01'),
    crossReferences: [
      'gdpr-2016:article-32', // GDPR Article 32 - Security of Processing
      'iso-27001:2022:control-8.2', // ISO 27001 Input Validation
      'nist-csf:de-ae-1' // NIST CSF Data Encryption
    ],
    knowledgeChunks: [
      {
        id: 'owasp-a03-desc',
        text: 'Injection vulnerabilities allow attackers to execute malicious code or commands through application inputs. This includes SQL injection, NoSQL injection, command injection, and other interpreter-based attacks.',
        embedding: undefined
      },
      {
        id: 'owasp-a03-req',
        text: 'Validate and sanitize all user inputs, use parameterized queries and prepared statements, implement input validation and output encoding, use safe APIs and frameworks, implement proper error handling without information disclosure',
        embedding: undefined
      }
    ]
  },
  {
    id: 'owasp-a04-2021',
    frameworkId: 'owasp-top10-2021',
    title: 'A04:2021 - Insecure Design',
    description: 'Insecure Design is a broad category representing different weaknesses, expressed as "missing or ineffective control design." Insecure design cannot be fixed by proper implementation.',
    citation: 'A04:2021',
    content: 'Insecure design refers to missing or ineffective control design that cannot be fixed by proper implementation. This includes architectural flaws, missing security controls, and design-level vulnerabilities.',
    impact: 'HIGH',
    category: 'Architecture',
    requirements: [
      'Implement secure design principles from the start',
      'Use threat modeling for all new applications',
      'Implement defense in depth strategies',
      'Design with security as a core requirement',
      'Regular security architecture reviews'
    ],
    implementation: [
      'Conduct threat modeling sessions for all new features',
      'Implement secure design patterns and principles',
      'Use security-focused architecture frameworks',
      'Regular security architecture assessments',
      'Security training for architects and designers'
    ],
    compliance: [
      'Regular security architecture reviews',
      'Threat modeling for all new applications',
      'Security training for development teams',
      'Compliance with secure design standards'
    ],
    confidence: 1.0, // Official OWASP source
    source: 'OWASP Top 10 2021 - Official Documentation',
    sourceUrl: 'https://owasp.org/Top10/A04_2021-Insecure_Design/',
    lastUpdated: new Date('2021-01-01'),
    crossReferences: [
      'gdpr-2016:article-25', // GDPR Article 25 - Data Protection by Design
      'iso-27001:2022:control-8.1', // ISO 27001 Information Security Policies
      'nist-csf:de-cm-1' // NIST CSF Configuration Management
    ],
    knowledgeChunks: [
      {
        id: 'owasp-a04-desc',
        text: 'Insecure design refers to missing or ineffective control design that cannot be fixed by proper implementation. This includes architectural flaws, missing security controls, and design-level vulnerabilities.',
        embedding: undefined
      },
      {
        id: 'owasp-a04-req',
        text: 'Implement secure design principles from the start, use threat modeling for all new applications, implement defense in depth strategies, design with security as a core requirement, regular security architecture reviews',
        embedding: undefined
      }
    ]
  },
  {
    id: 'owasp-a05-2021',
    frameworkId: 'owasp-top10-2021',
    title: 'A05:2021 - Security Misconfiguration',
    description: 'Security Misconfiguration is the most commonly seen issue. This is commonly a result of insecure default configurations, incomplete or ad hoc configurations, open cloud storage, misconfigured HTTP headers, and verbose error messages containing sensitive information.',
    citation: 'A05:2021',
    content: 'Security misconfiguration occurs when security settings are not properly configured, default settings are left unchanged, or security controls are not implemented correctly.',
    impact: 'HIGH',
    category: 'Configuration',
    requirements: [
      'Implement secure default configurations',
      'Regular security configuration reviews',
      'Secure deployment and configuration management',
      'Implement security headers and controls',
      'Regular vulnerability scanning and patching'
    ],
    implementation: [
      'Use security configuration templates',
      'Implement automated configuration validation',
      'Regular security configuration audits',
      'Automated security scanning in deployment',
      'Security configuration management tools'
    ],
    compliance: [
      'Regular configuration security audits',
      'Automated configuration validation',
      'Security configuration standards compliance',
      'Regular vulnerability assessments'
    ],
    confidence: 1.0, // Official OWASP source
    source: 'OWASP Top 10 2021 - Official Documentation',
    sourceUrl: 'https://owasp.org/Top10/A05_2021-Security_Misconfiguration/',
    lastUpdated: new Date('2021-01-01'),
    crossReferences: [
      'gdpr-2016:article-32', // GDPR Article 32 - Security of Processing
      'iso-27001:2022:control-8.1', // ISO 27001 Information Security Policies
      'nist-csf:de-cm-1' // NIST CSF Configuration Management
    ],
    knowledgeChunks: [
      {
        id: 'owasp-a05-desc',
        text: 'Security misconfiguration occurs when security settings are not properly configured, default settings are left unchanged, or security controls are not implemented correctly.',
        embedding: undefined
      },
      {
        id: 'owasp-a05-req',
        text: 'Implement secure default configurations, regular security configuration reviews, secure deployment and configuration management, implement security headers and controls, regular vulnerability scanning and patching',
        embedding: undefined
      }
    ]
  }
];

// Framework metadata
export const OWASP_TOP_10_2021_METADATA = {
  id: 'owasp-top10-2021',
  name: 'OWASP Top 10 Web Application Security Risks',
  version: '2021',
  jurisdiction: 'Global',
  authority: 'OWASP Foundation',
  effectiveDate: new Date('2021-01-01'),
  lastUpdated: new Date('2021-01-01'),
  confidence: 1.0, // Official source
  sourceUrl: 'https://owasp.org/Top10/',
  checksum: 'sha256:owasp-top10-2021-official-documentation' // Placeholder
};
