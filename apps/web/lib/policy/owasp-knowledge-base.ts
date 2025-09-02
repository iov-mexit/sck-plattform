// OWASP Top 10 2021 Knowledge Base - High Confidence
// Official Source: OWASP Foundation
// Confidence: 1.0 (Official regulatory source)

import { RegulatoryRequirement, ConfidenceValidator } from './structured-knowledge-schema';

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
    lastUpdated: new Date('2021-01-01')
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
    lastUpdated: new Date('2021-01-01')
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
    lastUpdated: new Date('2021-01-01')
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
    lastUpdated: new Date('2021-01-01')
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
    lastUpdated: new Date('2021-01-01')
  }
];

// High-Confidence OWASP Knowledge Manager
export class OWASPKnowledgeManager {
  private requirements: Map<string, RegulatoryRequirement> = new Map();

  constructor() {
    this.initializeOWASPKnowledge();
  }

  private initializeOWASPKnowledge(): void {
    OWASP_TOP_10_2021.forEach(requirement => {
      // Validate confidence before adding
      if (ConfidenceValidator.validateRequirement(requirement)) {
        this.requirements.set(requirement.id, requirement);
        console.log(`✅ OWASP requirement added: ${requirement.citation} - ${requirement.title} (confidence: ${requirement.confidence})`);
      } else {
        console.error(`❌ OWASP requirement rejected: ${requirement.citation} - confidence too low (${requirement.confidence})`);
      }
    });

    console.log(`🎯 OWASP Top 10 knowledge base initialized: ${this.requirements.size} high-confidence requirements`);
  }

  // Get requirement by citation (e.g., "A01:2021")
  getRequirementByCitation(citation: string): RegulatoryRequirement | undefined {
    return Array.from(this.requirements.values())
      .find(req => req.citation === citation);
  }

  // Get all requirements
  getAllRequirements(): RegulatoryRequirement[] {
    return Array.from(this.requirements.values());
  }

  // Get requirements by category
  getRequirementsByCategory(category: string): RegulatoryRequirement[] {
    return Array.from(this.requirements.values())
      .filter(req => req.category.toLowerCase() === category.toLowerCase());
  }

  // Get requirements by impact level
  getRequirementsByImpact(impact: 'HIGH' | 'MEDIUM' | 'LOW'): RegulatoryRequirement[] {
    return Array.from(this.requirements.values())
      .filter(req => req.impact === impact);
  }

  // Search requirements by keyword
  searchRequirements(keyword: string): RegulatoryRequirement[] {
    const searchTerm = keyword.toLowerCase();
    return Array.from(this.requirements.values())
      .filter(req =>
        req.title.toLowerCase().includes(searchTerm) ||
        req.description.toLowerCase().includes(searchTerm) ||
        req.content.toLowerCase().includes(searchTerm) ||
        req.category.toLowerCase().includes(searchTerm)
      );
  }

  // Validate knowledge base integrity
  validateKnowledgeBase(): {
    valid: boolean;
    totalRequirements: number;
    highConfidenceRequirements: number;
    lowConfidenceRequirements: number;
  } {
    const allRequirements = this.getAllRequirements();
    const highConfidence = allRequirements.filter(req => req.confidence >= 0.9).length;
    const lowConfidence = allRequirements.filter(req => req.confidence < 0.9).length;

    return {
      valid: lowConfidence === 0,
      totalRequirements: allRequirements.length,
      highConfidenceRequirements: highConfidence,
      lowConfidenceRequirements: lowConfidence
    };
  }

  // Get confidence statistics
  getConfidenceStats(): {
    averageConfidence: number;
    minConfidence: number;
    maxConfidence: number;
    confidenceDistribution: { [key: string]: number };
  } {
    const allRequirements = this.getAllRequirements();
    const confidences = allRequirements.map(req => req.confidence);

    const averageConfidence = confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
    const minConfidence = Math.min(...confidences);
    const maxConfidence = Math.max(...confidences);

    const distribution = {
      '0.9-0.94': allRequirements.filter(req => req.confidence >= 0.9 && req.confidence < 0.95).length,
      '0.95-0.99': allRequirements.filter(req => req.confidence >= 0.95 && req.confidence < 1.0).length,
      '1.0': allRequirements.filter(req => req.confidence === 1.0).length
    };

    return {
      averageConfidence,
      minConfidence,
      maxConfidence,
      confidenceDistribution: distribution
    };
  }
}

