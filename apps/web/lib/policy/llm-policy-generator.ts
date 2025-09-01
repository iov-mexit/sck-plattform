// LLM-Powered Policy Generator with Few-Shot Training
// Real intelligence, not just string templating!

import { llmChat, LLMMessage } from '../ai/llm';
import { RegulatoryFramework } from './role-regulation-matrix';

export interface LLMPolicyRequest {
  regulatoryFramework: RegulatoryFramework;
  roleTitle: string;
  roleCategory: string;
  specificRequirement: string;
  confidenceThreshold: number;
  context?: string;
}

export interface LLMPolicyResult {
  success: boolean;
  policy: {
    title: string;
    content: string;
    framework: RegulatoryFramework;
    roleTarget: string;
    requirements: string[];
    implementation: string[];
    compliance: string[];
    citations: string[];
  };
  metadata: {
    generationTime: string;
    modelUsed: string;
    promptTokens: number;
    responseTokens: number;
    confidence: number;
  };
}

export class LLMPolicyGenerator {
  private fewShotExamples: Map<RegulatoryFramework, string[]>;
  private systemPrompts: Map<RegulatoryFramework, string>;

  constructor() {
    this.initializeFewShotExamples();
    this.initializeSystemPrompts();
  }

  private initializeFewShotExamples(): void {
    this.fewShotExamples = new Map();

    // OWASP Few-Shot Examples
    this.fewShotExamples.set('OWASP', [
      `# L4 Security Engineer OWASP Security Controls Policy

## Purpose
This policy establishes comprehensive OWASP Top 10 security controls for L4 Security Engineer roles, ensuring robust web application security and compliance with industry best practices.

## OWASP Top 10 Requirements

### A01:2021: Broken Access Control
**Context**: Access control vulnerabilities remain the most critical security risk, affecting 94% of applications tested.

**Specific Requirements for L4 Security Engineers:**
- Implement role-based access control (RBAC) with principle of least privilege
- Design and enforce session management controls with secure token handling
- Implement API access controls with proper authentication and authorization
- Conduct regular access control testing and penetration testing
- Monitor and log all access attempts with anomaly detection

**Implementation Guidelines:**
- Use OAuth 2.0/OpenID Connect for authentication flows
- Implement JWT token validation with proper expiration handling
- Design microservice access controls with service mesh security
- Regular security code reviews focusing on access control patterns
- Automated testing for privilege escalation scenarios

**Compliance Monitoring:**
- Quarterly access control assessments using OWASP testing guide
- Annual penetration testing with focus on authorization bypass
- Regular audit of user permissions and role assignments
- Performance metrics for access control effectiveness`,

      `# L3 DevOps Engineer OWASP Security Controls Policy

## Purpose
This policy establishes OWASP Top 10 security controls for L3 DevOps Engineer roles, ensuring secure CI/CD practices and infrastructure security.

## OWASP Top 10 Requirements

### A02:2021: Cryptographic Failures
**Context**: Cryptographic failures can lead to data exposure and system compromise.

**Specific Requirements for L3 DevOps Engineers:**
- Implement secure key management for CI/CD pipelines
- Use strong encryption for secrets and configuration files
- Implement secure communication protocols (TLS 1.3)
- Regular rotation of encryption keys and certificates
- Secure storage of sensitive configuration data

**Implementation Guidelines:**
- Use HashiCorp Vault for secrets management
- Implement automated certificate rotation
- Secure API communications with mutual TLS
- Regular security scanning of infrastructure code
- Automated compliance checking in deployment pipelines`
    ]);

    // GDPR Few-Shot Examples
    this.fewShotExamples.set('GDPR', [
      `# L4 Data Protection Officer GDPR Compliance Policy

## Purpose
This policy establishes GDPR compliance requirements for L4 Data Protection Officer roles, ensuring comprehensive data protection and privacy controls.

## GDPR Requirements

### Article 25: Data Protection by Design and by Default
**Context**: Controllers must implement appropriate technical and organizational measures at the time of processing design.

**Specific Requirements for L4 DPOs:**
- Design data processing systems with privacy-first architecture
- Implement data minimization and purpose limitation controls
- Ensure pseudonymization and encryption by default
- Conduct Data Protection Impact Assessments (DPIAs)
- Establish privacy engineering practices and standards

**Implementation Guidelines:**
- Use privacy-enhancing technologies (PETs) in system design
- Implement data classification and labeling systems
- Regular privacy training for development teams
- Automated privacy compliance checking in CI/CD
- Regular review of data processing activities

**Compliance Monitoring:**
- Quarterly privacy impact assessments
- Annual GDPR compliance audits
- Regular training and awareness programs
- Performance metrics for privacy controls effectiveness`,

      `# L3 Security Engineer GDPR Data Protection Policy

## Purpose
This policy establishes GDPR compliance requirements for L3 Security Engineer roles, ensuring technical implementation of data protection controls.

## GDPR Requirements

### Article 32: Security of Processing
**Context**: Controllers must implement appropriate technical and organizational measures for data security.

**Specific Requirements for L3 Security Engineers:**
- Implement encryption for data at rest and in transit
- Design secure authentication and authorization systems
- Implement data backup and disaster recovery procedures
- Regular security testing and vulnerability assessment
- Monitor and log data processing activities

**Implementation Guidelines:**
- Use industry-standard encryption algorithms (AES-256, RSA-4096)
- Implement secure key management and rotation
- Regular penetration testing and security assessments
- Automated security monitoring and alerting
- Incident response procedures for data breaches`
    ]);

    // NIS2 Few-Shot Examples
    this.fewShotExamples.set('NIS2', [
      `# L4 Cybersecurity Manager NIS2 Compliance Policy

## Purpose
This policy establishes NIS2 cybersecurity requirements for L4 Cybersecurity Manager roles, ensuring robust incident response and security controls.

## NIS2 Requirements

### Incident Response and Reporting
**Context**: NIS2 requires rapid incident detection, response, and reporting to authorities.

**Specific Requirements for L4 Cybersecurity Managers:**
- Establish 24/7 Security Operations Center (SOC)
- Implement automated threat detection and response systems
- Design incident escalation procedures with clear timelines
- Regular incident response training and tabletop exercises
- Establish communication protocols with regulatory authorities

**Implementation Guidelines:**
- Use SIEM systems for centralized security monitoring
- Implement automated incident response playbooks
- Regular penetration testing and red team exercises
- Establish relationships with cybersecurity information sharing groups
- Regular review and update of incident response procedures

**Compliance Monitoring:**
- Monthly incident response readiness assessments
- Quarterly tabletop exercises and training
- Annual NIS2 compliance audits
- Performance metrics for incident response effectiveness`
    ]);
  }

  private initializeSystemPrompts(): void {
    this.systemPrompts = new Map();

    this.systemPrompts.set('OWASP', `You are an expert cybersecurity policy writer specializing in OWASP Top 10 security controls. 

Your task is to generate comprehensive, actionable security policies that:
1. Reference specific OWASP Top 10 categories (A01:2021, A02:2021, etc.)
2. Provide role-specific implementation requirements
3. Include measurable compliance metrics
4. Use technical language appropriate for security professionals
5. Follow industry best practices and standards

IMPORTANT: Always include specific OWASP category references, real vulnerability statistics, and actionable technical requirements. Avoid generic language.`);

    this.systemPrompts.set('GDPR', `You are an expert data protection and privacy policy writer specializing in GDPR compliance.

Your task is to generate comprehensive, actionable GDPR compliance policies that:
1. Reference specific GDPR articles (Article 25, Article 32, etc.)
2. Provide role-specific implementation requirements
3. Include technical and organizational measures
4. Address data subject rights and controller obligations
5. Follow GDPR regulatory requirements precisely

IMPORTANT: Always include specific GDPR article references, real regulatory text, and actionable compliance requirements. Avoid generic language.`);

    this.systemPrompts.set('NIS2', `You are an expert cybersecurity policy writer specializing in NIS2 (Network and Information Security) compliance.

Your task is to generate comprehensive, actionable NIS2 cybersecurity policies that:
1. Address incident response and reporting requirements
2. Include technical security measures
3. Provide role-specific implementation guidelines
4. Address supply chain security and risk management
5. Follow NIS2 regulatory requirements precisely

IMPORTANT: Always include specific NIS2 requirements, real cybersecurity measures, and actionable implementation guidelines. Avoid generic language.`);
  }

  async generateLLMPolicy(request: LLMPolicyRequest): Promise<LLMPolicyResult> {
    const startTime = Date.now();

    try {
      // Get framework-specific system prompt and few-shot examples
      const systemPrompt = this.systemPrompts.get(request.regulatoryFramework);
      const fewShotExamples = this.fewShotExamples.get(request.regulatoryFramework);

      if (!systemPrompt || !fewShotExamples) {
        throw new Error(`Unsupported framework: ${request.regulatoryFramework}`);
      }

      // Build the LLM prompt with few-shot training
      const messages: LLMMessage[] = [
        { role: 'system', content: systemPrompt },
        ...fewShotExamples.map(example => ({ role: 'assistant', content: example })),
        { role: 'user', content: this.buildUserPrompt(request) }
      ];

      // Generate policy using LLM
      const llmResponse = await llmChat(messages);

      // Parse and structure the LLM response
      const parsedPolicy = this.parseLLMResponse(llmResponse, request);

      return {
        success: true,
        policy: parsedPolicy,
        metadata: {
          generationTime: new Date().toISOString(),
          modelUsed: 'llama3.1:8b-instruct',
          promptTokens: this.estimateTokenCount(messages),
          responseTokens: this.estimateTokenCount([{ role: 'assistant', content: llmResponse }]),
          confidence: this.calculateConfidence(parsedPolicy, request)
        }
      };

    } catch (error) {
      console.error('❌ Error generating LLM policy:', error);
      throw error;
    }
  }

  private buildUserPrompt(request: LLMPolicyRequest): string {
    return `Generate a comprehensive ${request.regulatoryFramework} compliance policy for a ${request.roleTitle} role in the ${request.roleCategory} category.

Specific Requirement: ${request.specificRequirement}

Requirements:
1. Use the exact format and structure shown in the examples above
2. Include specific ${request.regulatoryFramework} references and requirements
3. Provide role-specific implementation guidelines
4. Include measurable compliance metrics
5. Use technical language appropriate for ${request.roleTitle} professionals
6. Avoid generic language - be specific and actionable

Context: ${request.context || 'Standard compliance requirements'}

Generate a complete policy that follows the examples above exactly.`;
  }

  private parseLLMResponse(response: string, request: LLMPolicyRequest): any {
    // Extract title from the response
    const titleMatch = response.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : `${request.roleTitle} ${request.regulatoryFramework} Policy`;

    // Extract requirements, implementation, and compliance sections
    const requirements = this.extractSectionContent(response, 'Requirements');
    const implementation = this.extractSectionContent(response, 'Implementation');
    const compliance = this.extractSectionContent(response, 'Compliance');

    // Extract citations (look for references to specific articles/controls)
    const citations = this.extractCitations(response, request.regulatoryFramework);

    return {
      title,
      content: response,
      framework: request.regulatoryFramework,
      roleTarget: `${request.roleTitle} (${request.roleCategory})`,
      requirements,
      implementation,
      compliance,
      citations
    };
  }

  private extractSectionContent(content: string, sectionName: string): string[] {
    const sectionRegex = new RegExp(`## ${sectionName}[\\s\\S]*?(?=##|$)`, 'i');
    const match = content.match(sectionRegex);
    if (!match) return [];

    const sectionContent = match[0];
    const listItems = sectionContent.match(/- (.+)$/gm);
    return listItems ? listItems.map(item => item.replace('- ', '').trim()) : [];
  }

  private extractCitations(content: string, framework: RegulatoryFramework): string[] {
    const citations: string[] = [];

    if (framework === 'OWASP') {
      const owaspMatches = content.match(/A\d{2}:\d{4}/g);
      if (owaspMatches) citations.push(...owaspMatches);
    }

    if (framework === 'GDPR') {
      const gdprMatches = content.match(/Article \d+/g);
      if (gdprMatches) citations.push(...gdprMatches);
    }

    if (framework === 'NIS2') {
      const nis2Matches = content.match(/(incident response|cybersecurity|risk management)/gi);
      if (nis2Matches) citations.push(...nis2Matches);
    }

    return [...new Set(citations)]; // Remove duplicates
  }

  private estimateTokenCount(messages: LLMMessage[]): number {
    // Rough estimation: 1 token ≈ 4 characters
    const totalChars = messages.reduce((sum, msg) => sum + msg.content.length, 0);
    return Math.ceil(totalChars / 4);
  }

  private calculateConfidence(policy: any, request: LLMPolicyRequest): number {
    let confidence = 0.5; // Base confidence

    // Boost confidence based on specific framework references
    if (policy.citations.length > 0) confidence += 0.2;
    if (policy.requirements.length > 3) confidence += 0.1;
    if (policy.implementation.length > 2) confidence += 0.1;
    if (policy.compliance.length > 2) confidence += 0.1;

    // Check for framework-specific content
    const content = policy.content.toLowerCase();
    if (request.regulatoryFramework === 'OWASP' && content.includes('a01:2021')) confidence += 0.1;
    if (request.regulatoryFramework === 'GDPR' && content.includes('article')) confidence += 0.1;
    if (request.regulatoryFramework === 'NIS2' && content.includes('incident')) confidence += 0.1;

    return Math.min(confidence, 0.95); // Cap at 95%
  }
}
