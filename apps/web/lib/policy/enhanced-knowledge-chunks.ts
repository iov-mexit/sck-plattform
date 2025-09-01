import { RegulatoryRequirement, FrameworkMetadata } from './regulatory-core';

export interface EnhancedKnowledgeChunk {
  id: string;
  text: string;
  chunkType: 'DESCRIPTION' | 'REQUIREMENT' | 'OBLIGATION' | 'IMPLEMENTATION' | 'COMPLIANCE' | 'TEST_CASES' | 'MITIGATION_SNIPPET' | 'CI_CHECKLIST' | 'CROSS_REF_CVE' | 'LAW_TEXT_SNIPPET' | 'EXAMPLE_USECASE' | 'MAPPING_ISO42001' | 'CONTROL';
  metadata: {
    language: string;
    confidence: number;
    source: string;
    canonical?: string;
    article?: string;
    jurisdiction?: string;
    framework?: string;
    concepts?: string[];
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    targetRoles?: string[];
    lastUpdated?: Date;
    roleSpecificRelevance?: string[];
  };
  embedding?: number[];
}

export interface RegulatoryFrameworkData {
  frameworkId: string;
  metadata: FrameworkMetadata;
  requirements: RegulatoryRequirement[];
  knowledgeChunks: EnhancedKnowledgeChunk[];
}

// OWASP Web Top 10 Knowledge Chunks
export const OWASP_WEB_TOP10_CHUNKS: EnhancedKnowledgeChunk[] = [
  {
    id: 'owasp-web-a01-desc',
    text: 'Broken Access Control: Occurs when users can act outside their intended permissions. Typical issues: missing or insufficient server-side authorization checks for endpoints, access to object identifiers without owner checks. Attack patterns include IDOR (Insecure Direct Object Reference) and parameter tampering.',
    chunkType: 'DESCRIPTION',
    metadata: {
      language: 'en',
      confidence: 0.98,
      source: 'https://owasp.org/Top10/',
      canonical: 'OWASP Top 10 2021 - A01',
      framework: 'owasp-top10-2021',
      concepts: ['access control', 'authorization', 'IDOR', 'parameter tampering'],
      difficulty: 'intermediate',
      targetRoles: ['developer', 'security engineer', 'architect']
    }
  },
  {
    id: 'owasp-web-a02-desc',
    text: 'Cryptographic Failures: Sensitive data exposure due to weak or missing encryption. Common issues: weak encryption algorithms, improper key management, transmission of sensitive data over insecure channels.',
    chunkType: 'DESCRIPTION',
    metadata: {
      language: 'en',
      confidence: 0.98,
      source: 'https://owasp.org/Top10/',
      canonical: 'OWASP Top 10 2021 - A02',
      framework: 'owasp-top10-2021',
      concepts: ['cryptography', 'encryption', 'key management', 'data protection'],
      difficulty: 'intermediate',
      targetRoles: ['developer', 'security engineer', 'architect']
    }
  }
];

// EU AI Act Knowledge Chunks
export const EU_AI_ACT_CHUNKS: EnhancedKnowledgeChunk[] = [
  {
    id: 'ai-act-highrisk-obligations',
    text: 'High-risk AI systems must carry out risk assessments, maintain technical documentation describing purpose, dataset provenance, model architecture summary, testing results and mitigation measures; implement transparency measures for users and authorities; and maintain logs for post-market monitoring.',
    chunkType: 'OBLIGATION',
    metadata: {
      language: 'en',
      confidence: 0.95,
      source: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj',
      article: 'See AI Act (Reg. 2024/1689), Articles on high-risk systems and documentation',
      framework: 'eu-ai-act-2024',
      concepts: ['high-risk AI', 'risk assessment', 'technical documentation', 'transparency'],
      difficulty: 'advanced',
      targetRoles: ['legal counsel', 'compliance officer', 'ai engineer']
    }
  }
];

// ISO 42001 Knowledge Chunks
export const ISO_42001_CHUNKS: EnhancedKnowledgeChunk[] = [
  {
    id: 'iso42001-lifecycle-controls',
    text: 'AI lifecycle controls: establish development standards (data versioning, test sets), validation procedures (robustness, bias testing), deployment gates (canary rollouts, fail-safes), and continuous monitoring (performance drift, data drift, logging). Maintain records of retraining events and risk re-assessments.',
    chunkType: 'REQUIREMENT',
    metadata: {
      language: 'en',
      confidence: 0.92,
      source: 'https://www.iso.org/standard/42001',
      framework: 'iso-42001-2023',
      concepts: ['ai lifecycle', 'development standards', 'validation', 'monitoring'],
      difficulty: 'advanced',
      targetRoles: ['ai engineer', 'data scientist', 'product manager']
    }
  }
];

// ISO 27001 Knowledge Chunks
export const ISO_27001_CHUNKS: EnhancedKnowledgeChunk[] = [
  {
    id: 'iso27001-access-control',
    text: 'Control: Access control should restrict access to information and systems to authorized users. Implement role-based access, privileged account management, session handling, and regular access reviews as part of the ISMS.',
    chunkType: 'CONTROL',
    metadata: {
      language: 'en',
      confidence: 0.95,
      source: 'ISO/IEC 27001',
      framework: 'iso-27001-2022',
      concepts: ['access control', 'role-based access', 'privileged accounts', 'session management'],
      difficulty: 'intermediate',
      targetRoles: ['security engineer', 'system administrator', 'product manager']
    }
  },
  {
    id: 'iso27001-dev-desc',
    text: 'As a Developer, ISO 27001 requires you to implement secure coding practices, access controls, data protection, and security monitoring in your applications to support the organization\'s Information Security Management System.',
    chunkType: 'DESCRIPTION',
    metadata: {
      language: 'en',
      confidence: 0.95,
      source: 'ISO/IEC 27001:2022',
      canonical: 'ISO 27001 Developer Overview',
      framework: 'iso-27001-2022',
      concepts: ['secure coding', 'access controls', 'data protection', 'security monitoring'],
      difficulty: 'intermediate',
      targetRoles: ['developer', 'backend engineer', 'frontend engineer'],
      jurisdiction: 'Global',
      roleSpecificRelevance: [
        'Implement secure coding practices and security controls in your applications.',
        'Build access control and authentication mechanisms.',
        'Ensure data protection and implement security monitoring.'
      ]
    }
  },
  {
    id: 'iso27001-dev-examples',
    text: 'Use OWASP guidelines, implement proper authentication/authorization, encrypt sensitive data, and add security logging. Example: JWT tokens, role-based access control, AES encryption, security event logging.',
    chunkType: 'EXAMPLE_USECASE',
    metadata: {
      language: 'en',
      confidence: 0.95,
      source: 'ISO/IEC 27001:2022',
      framework: 'iso-27001-2022',
      concepts: ['OWASP guidelines', 'authentication', 'authorization', 'encryption', 'security logging'],
      difficulty: 'intermediate',
      targetRoles: ['developer'],
      jurisdiction: 'Global'
    }
  }
];

// NIS2 Knowledge Chunks
export const NIS2_CHUNKS: EnhancedKnowledgeChunk[] = [
  {
    id: 'nis2-incident-reporting',
    text: 'NIS2 requires rapid incident notification with defined timelines and the obligation to implement risk management measures across supply chains. Entities must appoint responsible persons and maintain incident response capabilities, with specific reporting thresholds for significant incidents.',
    chunkType: 'OBLIGATION',
    metadata: {
      language: 'en',
      confidence: 0.9,
      source: 'ENISA NIS2 Technical Implementation Guidance',
      framework: 'nis2-2023',
      concepts: ['incident reporting', 'risk management', 'supply chain', 'timelines'],
      difficulty: 'intermediate',
      targetRoles: ['security manager', 'compliance officer', 'product manager']
    }
  },
  {
    id: 'nis2-dev-desc',
    text: 'As a Developer, NIS2 requires you to implement security controls from design, build incident detection and reporting systems, ensure supply chain security, and create comprehensive logging for compliance.',
    chunkType: 'DESCRIPTION',
    metadata: {
      language: 'en',
      confidence: 0.95,
      source: 'NIS2 Directive (EU)',
      canonical: 'NIS2 Developer Overview',
      framework: 'nis2-2023',
      concepts: ['security controls', 'incident detection', 'supply chain security', 'compliance logging'],
      difficulty: 'intermediate',
      targetRoles: ['developer', 'security engineer', 'devops engineer'],
      jurisdiction: 'EU',
      roleSpecificRelevance: [
        'Implement security controls and monitoring from the design phase.',
        'Build automated incident detection and reporting systems.',
        'Ensure third-party dependencies are secure and validated.'
      ]
    }
  },
  {
    id: 'nis2-dev-examples',
    text: 'Implement security scanning in CI/CD, automated incident detection with alerting, dependency vulnerability scanning, and comprehensive audit logging. Example: SAST/DAST tools, SIEM integration, npm audit, audit logs.',
    chunkType: 'EXAMPLE_USECASE',
    metadata: {
      language: 'en',
      confidence: 0.95,
      source: 'NIS2 Directive (EU)',
      framework: 'nis2-2023',
      concepts: ['security scanning', 'incident detection', 'vulnerability scanning', 'audit logging'],
      difficulty: 'intermediate',
      targetRoles: ['developer'],
      jurisdiction: 'EU'
    }
  }
];

// DORA Knowledge Chunks
export const DORA_CHUNKS: EnhancedKnowledgeChunk[] = [
  {
    id: 'dora-3pp-oversight',
    text: 'DORA requires financial entities to implement robust oversight of ICT third-party providers, including contractual SLAs, access to audit rights, resilience tests, and exit strategies in case of provider failure.',
    chunkType: 'OBLIGATION',
    metadata: {
      language: 'en',
      confidence: 0.94,
      source: 'ESMA / DORA pages',
      framework: 'dora-2024',
      concepts: ['third-party oversight', 'SLAs', 'audit rights', 'resilience tests'],
      difficulty: 'intermediate',
      targetRoles: ['compliance officer', 'legal counsel', 'product manager']
    }
  },
  {
    id: 'dora-dev-desc',
    text: 'As a Developer, DORA requires you to build resilient systems with redundancy, implement comprehensive monitoring and logging, create incident response capabilities, and ensure third-party integrations are secure.',
    chunkType: 'DESCRIPTION',
    metadata: {
      language: 'en',
      confidence: 0.95,
      source: 'DORA Regulation (EU)',
      canonical: 'DORA Developer Overview',
      framework: 'dora-2024',
      concepts: ['resilience', 'monitoring', 'logging', 'incident response', 'third-party security'],
      difficulty: 'intermediate',
      targetRoles: ['developer', 'backend engineer', 'devops engineer'],
      jurisdiction: 'EU',
      roleSpecificRelevance: [
        'Implement redundancy and failover mechanisms in critical systems.',
        'Build comprehensive monitoring, logging, and alerting systems.',
        'Create incident response automation and third-party security validation.'
      ]
    }
  },
  {
    id: 'dora-dev-examples',
    text: 'Implement circuit breakers, health checks, automated failover, comprehensive logging with structured data, and third-party API security validation. Example: Kubernetes health checks, ELK stack logging, API gateway security.',
    chunkType: 'EXAMPLE_USECASE',
    metadata: {
      language: 'en',
      confidence: 0.95,
      source: 'DORA Regulation (EU)',
      framework: 'dora-2024',
      concepts: ['circuit breakers', 'health checks', 'failover', 'logging', 'API security'],
      difficulty: 'intermediate',
      targetRoles: ['developer'],
      jurisdiction: 'EU'
    }
  }
];

// CRA Knowledge Chunks
export const CRA_CHUNKS: EnhancedKnowledgeChunk[] = [
  {
    id: 'cra-vuln-mgmt',
    text: 'CRA mandates secure-by-design for products with digital components, including vulnerability handling policies, secure update/patch mechanisms, and obligations to publish security information to support responsible disclosure.',
    chunkType: 'REQUIREMENT',
    metadata: {
      language: 'en',
      confidence: 0.9,
      source: 'EUR-Lex Regulation (EU) 2024/2847',
      framework: 'cra-2024',
      concepts: ['secure-by-design', 'vulnerability management', 'patch mechanisms', 'responsible disclosure'],
      difficulty: 'intermediate',
      targetRoles: ['security engineer', 'product manager', 'developer']
    }
  },
  {
    id: 'cra-dev-desc',
    text: 'As a Developer, CRA requires you to implement secure-by-design principles in your code: use secure coding practices, implement automatic update mechanisms, handle vulnerabilities responsibly, and document security measures.',
    chunkType: 'DESCRIPTION',
    metadata: {
      language: 'en',
      confidence: 0.95,
      source: 'EUR-Lex CRA Regulation',
      canonical: 'CRA Developer Overview',
      framework: 'cra-2024',
      concepts: ['secure coding', 'update mechanisms', 'vulnerability handling', 'documentation'],
      difficulty: 'intermediate',
      targetRoles: ['developer', 'backend engineer', 'frontend engineer'],
      jurisdiction: 'EU',
      roleSpecificRelevance: [
        'Implement secure coding practices and automated security testing in CI/CD pipelines.',
        'Build automatic update mechanisms and patch delivery systems.',
        'Create vulnerability disclosure procedures and security documentation.'
      ]
    }
  },
  {
    id: 'cra-dev-examples',
    text: 'Use dependency scanning tools, implement automated security testing, create update APIs, and maintain security documentation. Example: npm audit in CI/CD, automated patch deployment, security.txt file.',
    chunkType: 'EXAMPLE_USECASE',
    metadata: {
      language: 'en',
      confidence: 0.95,
      source: 'EUR-Lex CRA Regulation',
      framework: 'cra-2024',
      concepts: ['dependency scanning', 'automated testing', 'update APIs', 'security documentation'],
      difficulty: 'intermediate',
      targetRoles: ['developer'],
      jurisdiction: 'EU'
    }
  }
];

// Role-Based Knowledge Framework for Product Managers
export const PRODUCT_MANAGER_ROLE_CHUNKS: EnhancedKnowledgeChunk[] = [
  // DORA - Digital Operational Resilience Act
  {
    id: 'dora-pm-desc',
    text: 'As a Product Manager, you must ensure that ICT systems your product depends on are resilient — this includes redundancy, resilience testing, and third-party contract clauses for continuity and exit strategies.',
    chunkType: 'DESCRIPTION',
    metadata: {
      language: 'en',
      confidence: 0.95,
      source: 'DORA Regulation (EU)',
      canonical: 'DORA Product Manager Overview',
      framework: 'dora-2022',
      concepts: ['resilience', 'third-party oversight', 'incident response', 'financial services'],
      difficulty: 'intermediate',
      targetRoles: ['product manager', 'project manager', 'business analyst'],
      jurisdiction: 'EU',
      roleSpecificRelevance: [
        'Incorporate resilience requirements into product development (e.g. redundancies, failover).',
        'Specify vendor SLAs and audit rights when integrating third-party model APIs or data services.',
        'Prepare for incident response: logging, monitoring, and reporting aligned with DORA timelines.'
      ]
    }
  },
  {
    id: 'dora-pm-examples',
    text: 'Ensure model inference API has rate-limits, fallback endpoints, and SLA-based availability guarantees. Define contractual terms with model hosting provider that allow resilience testing and exit strategy.',
    chunkType: 'EXAMPLE_USECASE',
    metadata: {
      language: 'en',
      confidence: 0.95,
      source: 'DORA Regulation (EU)',
      framework: 'dora-2022',
      concepts: ['api resilience', 'sla management', 'contract terms', 'fallback mechanisms'],
      difficulty: 'intermediate',
      targetRoles: ['product manager'],
      jurisdiction: 'EU'
    }
  },

  // NIS2 - Network & Information Systems Directive
  {
    id: 'nis2-pm-desc',
    text: 'As Product Manager, you\'re responsible for ensuring your product supports incident reporting and includes security controls from design, enabling the organization to meet NIS2 risk and reporting obligations.',
    chunkType: 'DESCRIPTION',
    metadata: {
      language: 'en',
      confidence: 0.9,
      source: 'ENISA NIS2 Guidance',
      canonical: 'NIS2 Product Manager Overview',
      framework: 'nis2-2023',
      concepts: ['incident reporting', 'security controls', 'risk management', 'essential services'],
      difficulty: 'intermediate',
      targetRoles: ['product manager', 'security manager'],
      jurisdiction: 'EU',
      roleSpecificRelevance: [
        'Define product features to align with organizational risk policies (e.g., encryption, access control).',
        'Ensure product metrics/logging support incident classification and reporting within NIS2 timelines.',
        'Include supply-chain security in vendor selection for components or APIs.'
      ]
    }
  },
  {
    id: 'nis2-pm-examples',
    text: 'Include structured logging and incident severity metrics to support compliance reporting. Choose third-party providers vetted against supply-chain risk controls.',
    chunkType: 'EXAMPLE_USECASE',
    metadata: {
      language: 'en',
      confidence: 0.9,
      source: 'ENISA NIS2 Guidance',
      framework: 'nis2-2023',
      concepts: ['logging', 'incident metrics', 'supply chain security', 'vendor vetting'],
      difficulty: 'intermediate',
      targetRoles: ['product manager'],
      jurisdiction: 'EU'
    }
  },

  // CRA - Cyber Resilience Act
  {
    id: 'cra-pm-desc',
    text: 'As a Product Manager, CRA requires your product to be built securely from the ground up, have patch/update mechanisms, and document how vulnerabilities are handled.',
    chunkType: 'DESCRIPTION',
    metadata: {
      language: 'en',
      confidence: 0.9,
      source: 'EUR-Lex CRA Regulation',
      canonical: 'CRA Product Manager Overview',
      framework: 'cra-2024',
      concepts: ['secure-by-design', 'vulnerability management', 'patch mechanisms', 'documentation'],
      difficulty: 'intermediate',
      targetRoles: ['product manager', 'security engineer'],
      jurisdiction: 'EU',
      roleSpecificRelevance: [
        'Incorporate secure-by-design principles into feature design and dependencies.',
        'Define and surface vulnerability handling workflows in product documentation.',
        'Ensure update/patch mechanisms are available and communicated.'
      ]
    }
  },
  {
    id: 'cra-developer-desc',
    text: 'As a Developer, CRA requires you to implement secure-by-design coding practices, build automatic update mechanisms, and ensure vulnerability handling is built into your codebase from the start.',
    chunkType: 'DESCRIPTION',
    metadata: {
      language: 'en',
      confidence: 0.95,
      source: 'EUR-Lex CRA Regulation',
      canonical: 'CRA Developer Overview',
      framework: 'cra-2024',
      concepts: ['secure-coding', 'automatic-updates', 'vulnerability-handling', 'secure-by-design'],
      difficulty: 'intermediate',
      targetRoles: ['developer', 'backend engineer', 'frontend engineer', 'devops engineer'],
      jurisdiction: 'EU',
      roleSpecificRelevance: [
        'Implement secure coding practices and input validation in all user-facing code.',
        'Build automatic update/patch delivery mechanisms into your applications.',
        'Include vulnerability scanning and reporting in your CI/CD pipelines.',
        'Document security practices and create secure coding guidelines for your team.'
      ]
    }
  },
  {
    id: 'cra-pm-examples',
    text: 'Feature specs include automatic patch delivery APIs or mechanisms. Product release notes include timelines for vulnerability handling and patch availability.',
    chunkType: 'EXAMPLE_USECASE',
    metadata: {
      language: 'en',
      confidence: 0.9,
      source: 'EUR-Lex CRA Regulation',
      framework: 'cra-2024',
      concepts: ['patch delivery', 'release notes', 'vulnerability timelines', 'feature specs'],
      difficulty: 'intermediate',
      targetRoles: ['product manager'],
      jurisdiction: 'EU'
    }
  },

  // ISO 42001 - AI Management Systems
  {
    id: 'iso42001-pm-desc',
    text: 'ISO 42001 expects AI-enabled products to include governance, risk management, transparency, and monitoring across the AI lifecycle — as PM, you must translate these into features and vendor assessments.',
    chunkType: 'DESCRIPTION',
    metadata: {
      language: 'en',
      confidence: 0.92,
      source: 'ISO 42001',
      canonical: 'ISO 42001 Product Manager Overview',
      framework: 'iso-42001-2023',
      concepts: ['ai governance', 'risk management', 'transparency', 'lifecycle monitoring'],
      difficulty: 'advanced',
      targetRoles: ['product manager', 'ai manager'],
      jurisdiction: 'Global',
      roleSpecificRelevance: [
        'Ensure features align with governance protocols: risk assessment, documentation, and testing are baked in.',
        'Validate third-party model providers meet governance controls.',
        'Incorporate lifecycle checkpoints (e.g., drift monitoring, retraining events) into the product roadmap.'
      ]
    }
  },
  {
    id: 'iso42001-pm-examples',
    text: 'Feature sprints include a \'drift monitoring\' dashboard and retraining review checkpoint. Third-party AI vendors are evaluated based on documentation, transparency, and audit access.',
    chunkType: 'EXAMPLE_USECASE',
    metadata: {
      language: 'en',
      confidence: 0.92,
      source: 'ISO 42001',
      framework: 'iso-42001-2023',
      concepts: ['drift monitoring', 'retraining', 'vendor evaluation', 'transparency'],
      difficulty: 'advanced',
      targetRoles: ['product manager'],
      jurisdiction: 'Global'
    }
  },

  // OWASP LLM Top-10
  {
    id: 'owasp-llm-pm-desc',
    text: 'As Product Manager, you must embed mitigations for LLM risks like prompt injection and hallucination—this means safe prompt templates, input sanitation, output filters, and adversarial testing built into your product roadmap.',
    chunkType: 'DESCRIPTION',
    metadata: {
      language: 'en',
      confidence: 0.95,
      source: 'OWASP LLM Top-10',
      canonical: 'OWASP LLM Product Manager Overview',
      framework: 'owasp-llm-top10-2024',
      concepts: ['prompt injection', 'hallucination', 'input sanitation', 'output filters', 'adversarial testing'],
      difficulty: 'intermediate',
      targetRoles: ['product manager', 'ai engineer'],
      jurisdiction: 'Global',
      roleSpecificRelevance: [
        'Feature requirements need to include prevention for prompt injection (e.g., input validation, instruction stripping).',
        'Define testing routines to detect injection, hallucination, or data drift issues.',
        'Include monitoring and safety check features like content filters and referral verifiers.'
      ]
    }
  },
  {
    id: 'owasp-llm-pm-examples',
    text: 'Use safe prompt templates and input sanitation guardrails in product UI. Include regression tests for injection or unexpected outputs before deployment.',
    chunkType: 'EXAMPLE_USECASE',
    metadata: {
      language: 'en',
      confidence: 0.95,
      source: 'OWASP LLM Top-10',
      framework: 'owasp-llm-top10-2024',
      concepts: ['safe prompts', 'input sanitation', 'regression tests', 'deployment checks'],
      difficulty: 'intermediate',
      targetRoles: ['product manager'],
      jurisdiction: 'Global'
    }
  }
];

// Combined knowledge chunks for ingestion
export const ALL_REGULATORY_CHUNKS: EnhancedKnowledgeChunk[] = [
  ...OWASP_WEB_TOP10_CHUNKS,
  ...EU_AI_ACT_CHUNKS,
  ...ISO_42001_CHUNKS,
  ...ISO_27001_CHUNKS,
  ...NIS2_CHUNKS,
  ...DORA_CHUNKS,
  ...CRA_CHUNKS,
  ...PRODUCT_MANAGER_ROLE_CHUNKS // Add the new role-based chunks
];

// Framework metadata for all regulations
export const FRAMEWORK_METADATA: Record<string, FrameworkMetadata> = {
  'owasp-top10-2021': {
    id: 'owasp-top10-2021',
    name: 'OWASP Top 10 Web Application Security Risks',
    version: '2021',
    jurisdiction: 'Global',
    authority: 'OWASP Foundation',
    effectiveDate: new Date('2021-01-01'),
    lastUpdated: new Date('2021-01-01'),
    confidence: 1.0,
    sourceUrl: 'https://owasp.org/Top10/',
    checksum: 'sha256:owasp-top10-2021-official-documentation'
  },
  'eu-ai-act-2024': {
    id: 'eu-ai-act-2024',
    name: 'EU Artificial Intelligence Act',
    version: '2024',
    jurisdiction: 'EU',
    authority: 'European Union',
    effectiveDate: new Date('2024-01-01'),
    lastUpdated: new Date('2024-01-01'),
    confidence: 1.0,
    sourceUrl: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj',
    checksum: 'sha256:eu-ai-act-2024-official-regulation'
  },
  'iso-42001-2023': {
    id: 'iso-42001-2023',
    name: 'ISO/IEC 42001 AI Management Systems',
    version: '2023',
    jurisdiction: 'Global',
    authority: 'ISO',
    effectiveDate: new Date('2023-01-01'),
    lastUpdated: new Date('2023-01-01'),
    confidence: 1.0,
    sourceUrl: 'https://www.iso.org/standard/42001',
    checksum: 'sha256:iso-42001-2023-official-standard'
  },
  'iso-27001-2022': {
    id: 'iso-27001-2022',
    name: 'ISO/IEC 27001 Information Security Management',
    version: '2022',
    jurisdiction: 'Global',
    authority: 'ISO',
    effectiveDate: new Date('2022-01-01'),
    lastUpdated: new Date('2022-01-01'),
    confidence: 1.0,
    sourceUrl: 'https://www.iso.org/standard/27001',
    checksum: 'sha256:iso-27001-2022-official-standard'
  },
  'nis2-2023': {
    id: 'nis2-2023',
    name: 'NIS2 Directive',
    version: '2023',
    jurisdiction: 'EU',
    authority: 'European Union',
    effectiveDate: new Date('2023-01-01'),
    lastUpdated: new Date('2023-01-01'),
    confidence: 1.0,
    sourceUrl: 'https://www.enisa.europa.eu/publications/nis2-technical-implementation-guidance',
    checksum: 'sha256:nis2-2023-official-directive'
  },
  'dora-2024': {
    id: 'dora-2024',
    name: 'Digital Operational Resilience Act',
    version: '2024',
    jurisdiction: 'EU',
    authority: 'European Union',
    effectiveDate: new Date('2024-01-01'),
    lastUpdated: new Date('2024-01-01'),
    confidence: 1.0,
    sourceUrl: 'https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/digital-operational-resilience-act-dora',
    checksum: 'sha256:dora-2024-official-regulation'
  },
  'cra-2024': {
    id: 'cra-2024',
    name: 'Cyber Resilience Act',
    version: '2024',
    jurisdiction: 'EU',
    authority: 'European Union',
    effectiveDate: new Date('2024-01-01'),
    lastUpdated: new Date('2024-01-01'),
    confidence: 1.0,
    sourceUrl: 'https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng',
    checksum: 'sha256:cra-2024-official-regulation'
  }
};

// Sample responses for training
export const PRODUCT_MANAGER_SAMPLE_RESPONSES = {
  'dora': {
    concise: 'As a Product Manager, DORA means you must bake in resilience and contractual safeguards when using third-party services—backup endpoints, SLAs, audit rights—so production incidents can be managed swiftly.',
    detailed: 'DORA requires that your product maintains operational resilience — you must structure contracts with model/data vendors allowing resilience tests and define fallback behavior, while ensuring logging and incident-response align with reporting obligations. These should be explicit in your roadmap and rollout plans.'
  },
  'nis2': {
    concise: 'NIS2 means your product must support incident logging, detection, and enable reporting within required timeframes, plus incorporate security measures and supply-chain scrutiny in feature planning.',
    detailed: 'Product Managers must treat security as part of core requirements: logging severity, access controls, and vendor vetting must be designed in. Moreover, you need to ensure that incidents can be classified and reported per NIS2 timelines and governance protocols.'
  },
  'cra': {
    concise: 'Under CRA, you need to ensure your product uses secure development practices, supports updates/patch mechanisms, and publishes vulnerability handling procedures.',
    detailed: 'CRA mandates security by design and vulnerability management: your product specs must built-in patching/update mechanisms, and documentation must show how vulnerabilities are handled. This ensures compliance and transparency for software components.'
  },
  'iso42001': {
    concise: 'As PM, ISO 42001 means your AI product needs built-in risk governance, lifecycle monitoring, transparency, and vendor scrutiny aligned with AI management systems.',
    detailed: 'ISO 42001 provides a structured framework for AI products: your product journey must include risk assessments, governance checkpoints, third-party evaluations, documentation, drift monitoring. These aspects should be translated into roadmap features and vendor contracts.'
  },
  'owasp-llm': {
    concise: 'OWASP LLM Top-10 means you need to integrate safeguards like sanitizing inputs, using safe prompt templates, and including tests for injection or malicious outputs in your product plan.',
    detailed: 'LLM-based features should be designed with known GenAI threat vectors in mind: prompt injection, hallucinations, unauthorized output. As PM, you should ensure safe input handling, output filters, and adversarial test suites are part of your development cycles. Include monitoring dashboards and regression tests for model behavior.'
  },
  'iso27001': {
    concise: 'As a Product Manager, ISO 27001 means aligning your product features with organizational security policies, ensuring access controls, audit trails, and risk management are built into your roadmap.',
    detailed: 'ISO 27001 requires that your product supports the organization\'s Information Security Management System (ISMS). This includes implementing access controls, audit logging, risk assessments, and security policies that align with organizational standards.'
  }
};
