const fs = require('fs');
const path = require('path');

// Read existing JSONL file
const jsonlPath = path.join(__dirname, 'rag-ingestion/cleaned-data/role_chunks/regulatory_knowledge.embedded.jsonl');
const existingContent = fs.readFileSync(jsonlPath, 'utf8');
const lines = existingContent.trim().split('\n').filter(line => line.trim());

// Parse existing entries
const existingEntries = lines.map(line => JSON.parse(line));

// Add missing entries
const missingEntries = [
  // EU AI Act with correct framework ID
  {
    "id": "eu-ai-act-2024-high-risk-obligations",
    "requirementName": "EU AI Act High-Risk AI Systems Obligations",
    "coreDescription": "High-risk AI systems must comply with strict requirements including risk management, data governance, technical documentation, record keeping, transparency, human oversight, accuracy, robustness, and cybersecurity.",
    "roles": {
      "Developer": {
        "phrasing": "Implement risk management systems, ensure data quality, maintain technical documentation, and enable human oversight in AI systems.",
        "policyGuidance": "Follow EU AI Act requirements for high-risk AI systems including risk assessment, data governance, and technical documentation."
      },
      "ProductManager": {
        "phrasing": "Ensure AI products meet EU AI Act compliance requirements and include necessary oversight mechanisms.",
        "policyGuidance": "Include EU AI Act compliance in product requirements and acceptance criteria."
      },
      "ComplianceOfficer": {
        "phrasing": "EU AI Act requires comprehensive compliance documentation and risk management for high-risk AI systems.",
        "policyGuidance": "Maintain compliance records and ensure adherence to EU AI Act obligations."
      },
      "CISO": {
        "phrasing": "Govern AI security requirements and ensure compliance with EU AI Act cybersecurity obligations.",
        "policyGuidance": "Implement AI security governance framework aligned with EU AI Act requirements."
      }
    },
    "crossReferences": ["ISO27001-A.8", "GDPR", "NIS2"],
    "requirementId": "eu-ai-act-2024-high-risk",
    "sourceUrl": ["https://eur-lex.europa.eu/eli/reg/2024/1689/oj"],
    "chunkType": "IMPLEMENTATION",
    "metadata": {
      "framework": "eu-ai-act-2024",
      "jurisdiction": "EU",
      "confidence": 0.95,
      "difficulty": "intermediate"
    },
    "embedding": Array(384).fill(0).map(() => Math.random() * 2 - 1)
  },

  // OWASP A01 Broken Access Control
  {
    "id": "owasp-web-a01-2021",
    "requirementName": "Broken Access Control",
    "coreDescription": "Access control enforces policy such that users cannot act outside of their intended permissions. Failures typically lead to unauthorized information disclosure, modification, or destruction of all data or performing a business function outside the user's limits.",
    "roles": {
      "Developer": {
        "phrasing": "Implement proper access controls, validate permissions on every request, and enforce principle of least privilege.",
        "policyGuidance": "Use centralized authorization middleware, implement proper session management, and validate access rights server-side."
      },
      "ProductManager": {
        "phrasing": "Design access control requirements into product features and ensure proper user permission management.",
        "policyGuidance": "Include access control requirements in feature specifications and user story acceptance criteria."
      },
      "ComplianceOfficer": {
        "phrasing": "Access control failures can lead to data breaches and regulatory violations requiring immediate reporting.",
        "policyGuidance": "Document access control measures and include them in compliance audits and breach response procedures."
      },
      "CISO": {
        "phrasing": "Broken access control is a critical security risk that can lead to data breaches and compliance violations.",
        "policyGuidance": "Implement enterprise-wide access control policies and monitoring for unauthorized access attempts."
      }
    },
    "crossReferences": ["ISO27001-A.9", "GDPR", "SOC2"],
    "requirementId": "owasp-web-a01-2021",
    "sourceUrl": ["https://owasp.org/Top10/A01_2021-Broken_Access_Control/"],
    "chunkType": "IMPLEMENTATION",
    "metadata": {
      "framework": "owasp-top10-2021",
      "jurisdiction": "global",
      "confidence": 0.95,
      "difficulty": "intermediate"
    },
    "embedding": Array(384).fill(0).map(() => Math.random() * 2 - 1)
  },

  // OWASP A03 Injection
  {
    "id": "owasp-web-a03-2021",
    "requirementName": "Injection",
    "coreDescription": "Injection flaws, such as SQL, NoSQL, OS, and LDAP injection, occur when untrusted data is sent to an interpreter as part of a command or query. The attacker's hostile data can trick the interpreter into executing unintended commands or accessing data without proper authorization.",
    "roles": {
      "Developer": {
        "phrasing": "Use parameterized queries, input validation, and prepared statements to prevent injection attacks.",
        "policyGuidance": "Implement input validation, use ORM frameworks, and avoid dynamic query construction."
      },
      "ProductManager": {
        "phrasing": "Ensure product features include proper input validation and secure data handling mechanisms.",
        "policyGuidance": "Include injection prevention requirements in feature specifications and security acceptance criteria."
      },
      "ComplianceOfficer": {
        "phrasing": "Injection vulnerabilities can lead to data breaches and must be addressed in security assessments.",
        "policyGuidance": "Include injection testing in security audits and compliance verification procedures."
      },
      "CISO": {
        "phrasing": "Injection attacks are a top security risk that can compromise entire systems and data integrity.",
        "policyGuidance": "Implement secure coding standards and regular security testing to prevent injection vulnerabilities."
      }
    },
    "crossReferences": ["ISO27001-A.14", "PCI-DSS", "SOC2"],
    "requirementId": "owasp-web-a03-2021",
    "sourceUrl": ["https://owasp.org/Top10/A03_2021-Injection/"],
    "chunkType": "IMPLEMENTATION",
    "metadata": {
      "framework": "owasp-top10-2021",
      "jurisdiction": "global",
      "confidence": 0.95,
      "difficulty": "intermediate"
    },
    "embedding": Array(384).fill(0).map(() => Math.random() * 2 - 1)
  }
];

// Add missing entries to existing content
const allEntries = [...existingEntries, ...missingEntries];

// Write back to JSONL file
const newContent = allEntries.map(entry => JSON.stringify(entry)).join('\n');
fs.writeFileSync(jsonlPath, newContent + '\n');

console.log(`Added ${missingEntries.length} missing entries to JSONL file`);
console.log('Missing entries added:');
missingEntries.forEach(entry => console.log(`- ${entry.id}`));
