const fs = require('fs');
const path = require('path');

// Read the existing JSONL file
const jsonlPath = path.join(__dirname, 'rag-ingestion/cleaned-data/role_chunks/regulatory_knowledge.embedded.jsonl');
const content = fs.readFileSync(jsonlPath, 'utf8');
const lines = content.trim().split('\n');

// Parse existing entries
const entries = lines.map(line => JSON.parse(line));

// Create IMPLEMENTATION chunks for developer-focused content
const implementationChunks = [
  {
    "id": "owasp-a01-implementation",
    "requirementName": "Broken Access Control Implementation",
    "coreDescription": "Technical implementation guide for access control mechanisms including authentication, authorization, and session management.",
    "roles": {
      "Developer": {
        "phrasing": "Implement JWT token validation, RBAC middleware, and session timeout controls.",
        "policyGuidance": "Use OAuth 2.0 with PKCE, implement principle of least privilege, and validate permissions on every request."
      },
      "ProductManager": {
        "phrasing": "Define user roles and permissions matrix for feature access control.",
        "policyGuidance": "Include access control requirements in user stories and acceptance criteria."
      },
      "ComplianceOfficer": {
        "phrasing": "Document access control policies and audit trails for compliance reporting.",
        "policyGuidance": "Maintain logs of access attempts and permission changes for regulatory audits."
      },
      "CISO": {
        "phrasing": "Establish enterprise-wide access control standards and monitoring.",
        "policyGuidance": "Define access control KPIs and implement centralized identity management."
      }
    },
    "crossReferences": ["ISO27001-A.9", "GDPR", "NIST-CSF"],
    "requirementId": "owasp-a01-implementation",
    "sourceUrl": ["https://owasp.org/Top10/", "https://www.iso.org/standard/27001"],
    "embedding": [-0.9, -0.8, -0.7, -0.6, -0.5, -0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    "chunkType": "IMPLEMENTATION",
    "metadata": {
      "confidence": 0.95,
      "framework": "owasp-top10-2021",
      "jurisdiction": "global",
      "difficulty": "intermediate"
    }
  },
  {
    "id": "owasp-a03-implementation",
    "requirementName": "Injection Attack Prevention Implementation",
    "coreDescription": "Technical implementation guide for preventing SQL injection, NoSQL injection, and other injection attacks through secure coding practices.",
    "roles": {
      "Developer": {
        "phrasing": "Use parameterized queries, input validation, and prepared statements to prevent injection attacks.",
        "policyGuidance": "Implement input sanitization, use ORM frameworks, and validate all user inputs."
      },
      "ProductManager": {
        "phrasing": "Ensure all data input forms have proper validation and error handling.",
        "policyGuidance": "Include input validation requirements in all user-facing features."
      },
      "ComplianceOfficer": {
        "phrasing": "Document injection prevention measures for security compliance audits.",
        "policyGuidance": "Maintain evidence of secure coding practices and vulnerability testing."
      },
      "CISO": {
        "phrasing": "Establish secure coding standards and regular security training for developers.",
        "policyGuidance": "Implement code review processes and automated security testing."
      }
    },
    "crossReferences": ["ISO27001-A.14", "NIST-CSF", "OWASP-ASVS"],
    "requirementId": "owasp-a03-implementation",
    "sourceUrl": ["https://owasp.org/Top10/", "https://www.iso.org/standard/27001"],
    "embedding": [-0.85, -0.75, -0.65, -0.55, -0.45, -0.35, -0.25, -0.15, -0.05, 0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95, 1.0],
    "chunkType": "IMPLEMENTATION",
    "metadata": {
      "confidence": 0.95,
      "framework": "owasp-top10-2021",
      "jurisdiction": "global",
      "difficulty": "intermediate"
    }
  },
  {
    "id": "gdpr-data-protection-implementation",
    "requirementName": "GDPR Data Protection Implementation",
    "coreDescription": "Technical implementation guide for GDPR compliance including data encryption, pseudonymization, and consent management.",
    "roles": {
      "Developer": {
        "phrasing": "Implement AES-256 encryption, pseudonymization algorithms, and consent management APIs.",
        "policyGuidance": "Use encryption at rest and in transit, implement data minimization, and provide data portability APIs."
      },
      "ProductManager": {
        "phrasing": "Design privacy-by-design features and user consent flows.",
        "policyGuidance": "Include privacy impact assessments in product development lifecycle."
      },
      "ComplianceOfficer": {
        "phrasing": "Document data processing activities and maintain records of consent.",
        "policyGuidance": "Implement data subject rights management and breach notification procedures."
      },
      "CISO": {
        "phrasing": "Establish data protection policies and incident response procedures.",
        "policyGuidance": "Implement data classification and access controls for personal data."
      }
    },
    "crossReferences": ["ISO27001-A.18", "NIST-CSF", "ISO27701"],
    "requirementId": "gdpr-data-protection-implementation",
    "sourceUrl": ["https://eur-lex.europa.eu/eli/reg/2016/679/oj", "https://www.iso.org/standard/27001"],
    "embedding": [-0.8, -0.7, -0.6, -0.5, -0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0.95],
    "chunkType": "IMPLEMENTATION",
    "metadata": {
      "confidence": 0.95,
      "framework": "gdpr",
      "jurisdiction": "EU",
      "difficulty": "advanced"
    }
  },
  {
    "id": "eu-ai-act-implementation",
    "requirementName": "EU AI Act Implementation Guide",
    "coreDescription": "Technical implementation guide for EU AI Act compliance including risk management, transparency, and human oversight.",
    "roles": {
      "Developer": {
        "phrasing": "Implement AI system logging, risk assessment tools, and human-in-the-loop controls.",
        "policyGuidance": "Use explainable AI techniques, implement bias detection, and provide transparency mechanisms."
      },
      "ProductManager": {
        "phrasing": "Define AI risk categories and user transparency requirements.",
        "policyGuidance": "Include AI Act compliance in product requirements and user experience design."
      },
      "ComplianceOfficer": {
        "phrasing": "Document AI system risk assessments and conformity procedures.",
        "policyGuidance": "Maintain technical documentation and monitoring evidence for AI Act compliance."
      },
      "CISO": {
        "phrasing": "Establish AI governance framework and risk management procedures.",
        "policyGuidance": "Implement AI system monitoring and incident response for high-risk AI systems."
      }
    },
    "crossReferences": ["ISO42001-2023", "NIST-AI-RMF", "IEEE-2859"],
    "requirementId": "eu-ai-act-implementation",
    "sourceUrl": ["https://eur-lex.europa.eu/eli/reg/2024/1689/oj", "https://www.iso.org/standard/42001"],
    "embedding": [-0.9, -0.8, -0.7, -0.6, -0.5, -0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    "chunkType": "IMPLEMENTATION",
    "metadata": {
      "confidence": 0.95,
      "framework": "eu-ai-act-2024",
      "jurisdiction": "EU",
      "difficulty": "advanced"
    }
  },
  {
    "id": "nis2-cybersecurity-implementation",
    "requirementName": "NIS2 Cybersecurity Implementation",
    "coreDescription": "Technical implementation guide for NIS2 directive compliance including incident reporting, risk management, and security measures.",
    "roles": {
      "Developer": {
        "phrasing": "Implement security monitoring, incident detection systems, and automated reporting mechanisms.",
        "policyGuidance": "Use SIEM tools, implement zero-trust architecture, and establish security baselines."
      },
      "ProductManager": {
        "phrasing": "Define cybersecurity requirements and incident response procedures.",
        "policyGuidance": "Include cybersecurity measures in product design and operational procedures."
      },
      "ComplianceOfficer": {
        "phrasing": "Document cybersecurity measures and incident reporting procedures.",
        "policyGuidance": "Maintain evidence of security controls and incident response capabilities."
      },
      "CISO": {
        "phrasing": "Establish cybersecurity governance and risk management framework.",
        "policyGuidance": "Implement comprehensive security program and regular security assessments."
      }
    },
    "crossReferences": ["ISO27001", "NIST-CSF", "ENISA-Guidelines"],
    "requirementId": "nis2-cybersecurity-implementation",
    "sourceUrl": ["https://www.enisa.europa.eu/publications/nis2-technical-implementation-guidance", "https://www.iso.org/standard/27001"],
    "embedding": [-0.85, -0.75, -0.65, -0.55, -0.45, -0.35, -0.25, -0.15, -0.05, 0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95, 1.0],
    "chunkType": "IMPLEMENTATION",
    "metadata": {
      "confidence": 0.95,
      "framework": "nis2-2023",
      "jurisdiction": "EU",
      "difficulty": "advanced"
    }
  }
];

// Add implementation chunks to existing entries
const updatedEntries = [...entries, ...implementationChunks];

// Write back to file
const updatedContent = updatedEntries.map(entry => JSON.stringify(entry)).join('\n');
fs.writeFileSync(jsonlPath, updatedContent);

console.log(`✅ Added ${implementationChunks.length} IMPLEMENTATION chunks to knowledge base`);
console.log(`📊 Total entries: ${updatedEntries.length}`);
console.log(`🔧 IMPLEMENTATION chunks: ${implementationChunks.length}`);
console.log(`📋 REQUIREMENT chunks: ${entries.length}`);


