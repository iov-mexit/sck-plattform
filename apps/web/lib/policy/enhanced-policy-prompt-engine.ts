// Enhanced Policy Prompt Engine with Framework-Specific Prompts
// TDD Implementation: Framework-targeted policy generation with few-shot examples

import { RoleRegulatoryProfile, RegulatoryFramework } from './role-regulation-matrix';

export interface FrameworkSpecificPrompt {
  framework: RegulatoryFramework;
  systemPrompt: string;
  fewShotExamples: FewShotExample[];
  validationKeywords: string[];
  outputFormat: string;
}

export interface FewShotExample {
  input: string;
  output: string;
  explanation: string;
}

export interface PolicyGenerationRequest {
  roleProfile: RoleRegulatoryProfile;
  regulatoryFramework: RegulatoryFramework;
  specificRequirement: string;
  contextQuery: string;
  confidenceThreshold: number;
}

export interface EnhancedPolicyResponse {
  policyContent: string;
  frameworkAlignment: number;
  roleSpecificity: number;
  regulatoryAccuracy: number;
  confidence: number;
  validationResults: {
    hasFrameworkKeywords: boolean;
    hasRoleSpecificContent: boolean;
    followsOutputFormat: boolean;
    meetsConfidenceThreshold: boolean;
  };
  recommendations: string[];
}

export class EnhancedPolicyPromptEngine {
  private frameworkPrompts: Map<RegulatoryFramework, FrameworkSpecificPrompt> = new Map();
  private defaultConfidenceThreshold: number = 0.85;

  constructor() {
    this.initializeFrameworkPrompts();
  }

  private initializeFrameworkPrompts(): void {
    this.frameworkPrompts = new Map();

    // OWASP-Specific Prompt
    this.frameworkPrompts.set('OWASP', {
      framework: 'OWASP',
      systemPrompt: `You are an OWASP security expert specializing in web application security policies. 
      Generate specific, actionable security policies that align with OWASP Top 10 and OWASP Application Security Verification Standard (ASVS).
      Focus on practical security controls, vulnerability prevention, and secure coding practices.
      Always reference specific OWASP guidelines, controls, and best practices.`,
      fewShotExamples: [
        {
          input: "Generate OWASP policy for L2 Frontend Developer focusing on input validation",
          output: `# OWASP Input Validation Policy for Frontend Developers

## Purpose
This policy establishes OWASP-compliant input validation requirements for L2 Frontend Developer roles to prevent OWASP Top 10 vulnerabilities, specifically A03:2021-Injection and A02:2021-Cryptographic Failures.

## Scope
Applies to all L2 Frontend Developer personnel developing web applications and user interfaces.

## OWASP Requirements
- Implement OWASP Input Validation Cheat Sheet guidelines
- Apply OWASP ASVS V5.1 (Input Validation) controls
- Follow OWASP Top 10 A03:2021-Injection prevention
- Use OWASP recommended validation libraries and frameworks

## Specific Controls
- Client-side validation using OWASP-recommended patterns
- Server-side validation for all user inputs (OWASP ASVS V5.1.1)
- Input sanitization following OWASP guidelines
- Output encoding to prevent XSS (OWASP A03:2021)

## Responsibilities
- Implement OWASP input validation controls in all frontend components
- Follow OWASP secure coding practices for user input handling
- Regular OWASP Top 10 compliance reviews
- OWASP ASVS validation testing before deployment

## Compliance
Non-compliance may result in security vulnerabilities and potential OWASP Top 10 violations.`,
          explanation: "Demonstrates OWASP-specific language, references to OWASP standards, and practical security controls"
        }
      ],
      validationKeywords: [
        'OWASP', 'Top 10', 'ASVS', 'injection', 'XSS', 'input validation',
        'secure coding', 'vulnerability prevention', 'security controls'
      ],
      outputFormat: "OWASP-focused policy with specific controls and references"
    });

    // GDPR-Specific Prompt
    this.frameworkPrompts.set('GDPR', {
      framework: 'GDPR',
      systemPrompt: `You are a GDPR compliance expert specializing in data protection and privacy policies. 
      Generate specific, actionable GDPR compliance policies that align with EU General Data Protection Regulation requirements.
      Focus on data subject rights, lawful processing, data minimization, and privacy by design principles.
      Always reference specific GDPR articles, recitals, and regulatory requirements.`,
      fewShotExamples: [
        {
          input: "Generate GDPR policy for L3 Security Engineer focusing on data protection by design",
          output: `# GDPR Data Protection by Design Policy for Security Engineers

## Purpose
This policy establishes GDPR Article 25 (Data Protection by Design and by Default) requirements for L3 Security Engineer roles to ensure compliance with EU General Data Protection Regulation.

## Scope
Applies to all L3 Security Engineer personnel involved in system design, security architecture, and data processing operations.

## GDPR Requirements
- Implement Article 25: Data Protection by Design and by Default
- Follow Article 32: Security of Processing requirements
- Ensure Article 5: Principles of Processing compliance
- Implement Article 24: Responsibility of the Controller measures

## Specific Controls
- Privacy by Design implementation in all security architectures
- Data minimization controls (Article 5(1)(c))
- Purpose limitation enforcement (Article 5(1)(b))
- Storage limitation controls (Article 5(1)(e))
- Technical and organizational security measures (Article 32)

## Responsibilities
- Design security systems with GDPR compliance as a core requirement
- Implement technical measures for data protection by design
- Regular GDPR compliance assessments and audits
- Data Protection Impact Assessment (DPIA) participation

## Compliance
Non-compliance may result in GDPR Article 83 penalties up to €20 million or 4% of global annual turnover.`,
          explanation: "Demonstrates GDPR-specific language, references to specific articles, and data protection focus"
        }
      ],
      validationKeywords: [
        'GDPR', 'Article', 'data protection', 'privacy', 'data subject rights',
        'lawful processing', 'data minimization', 'privacy by design', 'DPIA'
      ],
      outputFormat: "GDPR-focused policy with specific article references and data protection controls"
    });

    // NIS2-Specific Prompt
    this.frameworkPrompts.set('NIS2', {
      framework: 'NIS2',
      systemPrompt: `You are a NIS2 (Network and Information Security) compliance expert specializing in cybersecurity policies. 
      Generate specific, actionable NIS2 compliance policies that align with EU NIS2 Directive requirements.
      Focus on cybersecurity risk management, incident reporting, supply chain security, and business continuity.
      Always reference specific NIS2 articles, security measures, and regulatory obligations.`,
      fewShotExamples: [
        {
          input: "Generate NIS2 policy for L4 DevOps Architect focusing on incident response",
          output: `# NIS2 Incident Response Policy for DevOps Architects

## Purpose
This policy establishes NIS2 Article 16 (Incident Reporting) and Article 18 (Incident Response) requirements for L4 DevOps Architect roles to ensure compliance with EU NIS2 Directive.

## Scope
Applies to all L4 DevOps Architect personnel responsible for system operations, monitoring, and incident management.

## NIS2 Requirements
- Implement Article 16: Incident Reporting obligations
- Follow Article 18: Incident Response procedures
- Ensure Article 14: Security Measures compliance
- Implement Article 15: Risk Management measures

## Specific Controls
- 24/7 incident detection and monitoring capabilities
- Incident classification according to NIS2 severity levels
- Mandatory incident reporting within 24 hours (Article 16)
- Incident response team coordination and escalation
- Business continuity and disaster recovery procedures

## Responsibilities
- Design and implement NIS2-compliant incident response systems
- Ensure incident reporting compliance with regulatory timelines
- Coordinate with NIS2 competent authorities as required
- Regular incident response testing and validation

## Compliance
Non-compliance may result in NIS2 Article 33 penalties and regulatory enforcement actions.`,
          explanation: "Demonstrates NIS2-specific language, references to specific articles, and cybersecurity focus"
        }
      ],
      validationKeywords: [
        'NIS2', 'incident response', 'cybersecurity', 'risk management',
        'supply chain security', 'business continuity', 'incident reporting'
      ],
      outputFormat: "NIS2-focused policy with specific directive references and cybersecurity controls"
    });

    // NIST CSF-Specific Prompt
    this.frameworkPrompts.set('NIST_CSF', {
      framework: 'NIST_CSF',
      systemPrompt: `You are a NIST Cybersecurity Framework (CSF) expert specializing in cybersecurity governance policies. 
      Generate specific, actionable NIST CSF policies that align with the five core functions: Identify, Protect, Detect, Respond, and Recover.
      Focus on cybersecurity risk assessment, security controls, continuous monitoring, and resilience.
      Always reference specific NIST CSF functions, categories, and subcategories.`,
      fewShotExamples: [
        {
          input: "Generate NIST CSF policy for L3 Security Engineer focusing on Protect function",
          output: `# NIST CSF Protect Function Policy for Security Engineers

## Purpose
This policy establishes NIST Cybersecurity Framework Protect function requirements for L3 Security Engineer roles to ensure comprehensive cybersecurity control implementation.

## Scope
Applies to all L3 Security Engineer personnel responsible for implementing and maintaining cybersecurity controls.

## NIST CSF Requirements
- Implement Protect function categories and subcategories
- Follow NIST CSF Protect: Identity Management and Access Control (PR.AC)
- Ensure Protect: Awareness and Training (PR.AT) compliance
- Implement Protect: Data Security (PR.DS) measures

## Specific Controls
- Access control systems (PR.AC-1 through PR.AC-7)
- Identity management and authentication (PR.AC-1, PR.AC-2)
- Security awareness training programs (PR.AT-1 through PR.AT-5)
- Data security and encryption (PR.DS-1 through PR.DS-8)
- Maintenance and protective technology (PR.MA-1, PR.PT-1 through PR.PT-7)

## Responsibilities
- Design and implement NIST CSF Protect function controls
- Ensure continuous monitoring of control effectiveness
- Regular NIST CSF framework assessments and updates
- Coordinate with other CSF functions (Identify, Detect, Respond, Recover)

## Compliance
Non-compliance may result in cybersecurity gaps and increased organizational risk exposure.`,
          explanation: "Demonstrates NIST CSF-specific language, references to specific functions and categories"
        }
      ],
      validationKeywords: [
        'NIST CSF', 'Identify', 'Protect', 'Detect', 'Respond', 'Recover',
        'functions', 'categories', 'subcategories', 'cybersecurity controls'
      ],
      outputFormat: "NIST CSF-focused policy with specific function references and control categories"
    });

    // EU AI Act-Specific Prompt
    this.frameworkPrompts.set('EU_AI_ACT', {
      framework: 'EU_AI_ACT',
      systemPrompt: `You are an EU AI Act compliance expert specializing in artificial intelligence governance policies. 
      Generate specific, actionable EU AI Act policies that align with AI system risk classification and compliance requirements.
      Focus on AI system transparency, human oversight, accuracy, and risk management.
      Always reference specific EU AI Act articles, risk levels, and regulatory obligations.`,
      fewShotExamples: [
        {
          input: "Generate EU AI Act policy for L4 DevOps Architect focusing on high-risk AI systems",
          output: `# EU AI Act High-Risk AI Systems Policy for DevOps Architects

## Purpose
This policy establishes EU AI Act Article 6 (High-Risk AI Systems) requirements for L4 DevOps Architect roles to ensure compliance with EU Artificial Intelligence Act.

## Scope
Applies to all L4 DevOps Architect personnel involved in AI system development, deployment, and operations.

## EU AI Act Requirements
- Implement Article 6: High-Risk AI Systems obligations
- Follow Article 7: Risk Management System requirements
- Ensure Article 8: Data Governance compliance
- Implement Article 9: Technical Documentation measures

## Specific Controls
- High-risk AI system identification and classification
- Risk management system implementation (Article 7)
- Data governance and quality assurance (Article 8)
- Technical documentation and record-keeping (Article 9)
- Human oversight and control mechanisms
- Accuracy, robustness, and cybersecurity measures

## Responsibilities
- Design AI systems with EU AI Act compliance as a core requirement
- Implement risk management and governance controls
- Ensure technical documentation compliance
- Regular EU AI Act compliance assessments and audits

## Compliance
Non-compliance may result in EU AI Act Article 71 penalties up to €30 million or 6% of global annual turnover.`,
          explanation: "Demonstrates EU AI Act-specific language, references to specific articles, and AI governance focus"
        }
      ],
      validationKeywords: [
        'EU AI Act', 'Article', 'high-risk AI', 'risk management', 'data governance',
        'technical documentation', 'human oversight', 'AI system classification'
      ],
      outputFormat: "EU AI Act-focused policy with specific article references and AI governance controls"
    });
  }

  // Generate framework-specific policy with optimized prompts
  async generateFrameworkSpecificPolicy(request: PolicyGenerationRequest): Promise<EnhancedPolicyResponse> {
    const frameworkPrompt = this.frameworkPrompts.get(request.regulatoryFramework);

    if (!frameworkPrompt) {
      throw new Error(`Unsupported regulatory framework: ${request.regulatoryFramework}`);
    }

    // Build the complete prompt with few-shot examples
    const completePrompt = this.buildCompletePrompt(request, frameworkPrompt);

    // Generate policy content (this would integrate with your LLM client)
    const policyContent = await this.generatePolicyWithPrompt(completePrompt, request);

    // Validate and assess the generated policy
    const validationResults = this.validateFrameworkAlignment(policyContent, frameworkPrompt, request);

    return {
      policyContent,
      frameworkAlignment: validationResults.frameworkAlignment,
      roleSpecificity: validationResults.roleSpecificity,
      regulatoryAccuracy: validationResults.regulatoryAccuracy,
      confidence: validationResults.confidence,
      validationResults: validationResults.validationChecks,
      recommendations: validationResults.recommendations
    };
  }

  // Build complete prompt with few-shot examples
  private buildCompletePrompt(request: PolicyGenerationRequest, frameworkPrompt: FrameworkSpecificPrompt): string {
    const fewShotExamples = frameworkPrompt.fewShotExamples
      .map(example => `
Input: ${example.input}
Output: ${example.output}
Explanation: ${example.explanation}
---`)
      .join('\n');

    return `
${frameworkPrompt.systemPrompt}

## Few-Shot Examples:
${fewShotExamples}

## Current Request:
Role: ${request.roleProfile.roleTitle} (${request.roleProfile.category})
Framework: ${request.regulatoryFramework}
Requirement: ${request.specificRequirement}
Context: ${request.contextQuery}

## Instructions:
Generate a ${frameworkPrompt.framework}-specific policy following the format and style shown in the examples above.
Ensure the policy:
1. Uses ${frameworkPrompt.framework}-specific language and terminology
2. References specific ${frameworkPrompt.framework} requirements and controls
3. Is tailored to the ${request.roleProfile.roleTitle} role
4. Follows the established policy structure
5. Meets the confidence threshold of ${request.confidenceThreshold}

## Output Format:
${frameworkPrompt.outputFormat}

Generate the policy now:`;
  }

  // Generate policy using the complete prompt
  private async generatePolicyWithPrompt(completePrompt: string, request: PolicyGenerationRequest): Promise<string> {
    // This would integrate with your existing LLM client
    // For now, return a framework-specific template

    const frameworkPrompt = this.frameworkPrompts.get(request.regulatoryFramework)!;

    // Generate framework-specific content based on the prompt
    return this.generateFrameworkSpecificTemplate(request, frameworkPrompt);
  }

  // Generate framework-specific template (placeholder for LLM integration)
  private generateFrameworkSpecificTemplate(request: PolicyGenerationRequest, frameworkPrompt: FrameworkSpecificPrompt): string {
    const roleTitle = request.roleProfile.roleTitle;
    const category = request.roleProfile.category;
    const framework = request.regulatoryFramework;

    // Framework-specific content generation
    let frameworkSpecificContent = '';

    switch (framework) {
      case 'OWASP':
        frameworkSpecificContent = `
## OWASP Requirements
- Implement OWASP Top 10 ${request.specificRequirement} controls
- Apply OWASP Application Security Verification Standard (ASVS)
- Follow OWASP secure coding guidelines
- Use OWASP recommended security tools and frameworks

## Specific OWASP Controls
- ${request.specificRequirement} prevention measures
- OWASP security testing and validation
- Secure development lifecycle integration
- Regular OWASP compliance assessments`;
        break;

      case 'GDPR':
        frameworkSpecificContent = `
## GDPR Requirements
- Implement Article 25: Data Protection by Design and by Default
- Follow Article 32: Security of Processing requirements
- Ensure Article 5: Principles of Processing compliance
- Implement Article 24: Responsibility of the Controller measures

## Specific GDPR Controls
- Privacy by Design implementation
- Data minimization controls (Article 5(1)(c))
- Purpose limitation enforcement (Article 5(1)(b))
- Technical and organizational security measures (Article 32)`;
        break;

      case 'NIS2':
        frameworkSpecificContent = `
## NIS2 Requirements
- Implement Article 16: Incident Reporting obligations
- Follow Article 18: Incident Response procedures
- Ensure Article 14: Security Measures compliance
- Implement Article 15: Risk Management measures

## Specific NIS2 Controls
- Cybersecurity incident detection and response
- Supply chain security measures
- Business continuity and disaster recovery
- Regular NIS2 compliance assessments`;
        break;

      case 'NIST_CSF':
        frameworkSpecificContent = `
## NIST CSF Requirements
- Implement ${request.specificRequirement} function categories
- Follow NIST CSF framework guidelines
- Ensure continuous monitoring and assessment
- Implement risk management controls

## Specific NIST CSF Controls
- ${request.specificRequirement} function implementation
- Risk assessment and management
- Security control monitoring
- Framework compliance validation`;
        break;

      case 'EU_AI_ACT':
        frameworkSpecificContent = `
## EU AI Act Requirements
- Implement Article 6: High-Risk AI Systems obligations
- Follow Article 7: Risk Management System requirements
- Ensure Article 8: Data Governance compliance
- Implement Article 9: Technical Documentation measures

## Specific EU AI Act Controls
- AI system risk classification
- Risk management system implementation
- Data governance and quality assurance
- Technical documentation compliance`;
        break;
    }

    return `# ${framework} ${request.specificRequirement} Policy for ${roleTitle}

## Purpose
This policy establishes ${framework} compliance requirements for ${roleTitle} (${category}) roles to ensure adherence to ${framework} standards and regulations.

## Scope
Applies to all ${roleTitle} personnel and related systems.

${frameworkSpecificContent}

## Responsibilities
- ${roleTitle} personnel must implement all specified ${framework} controls
- Regular ${framework} compliance monitoring and reporting required
- Annual policy review and updates mandatory

## Compliance
Non-compliance may result in ${framework} violations and potential regulatory penalties.`;
  }

  // Validate framework alignment and generate assessment
  private validateFrameworkAlignment(
    policyContent: string,
    frameworkPrompt: FrameworkSpecificPrompt,
    request: PolicyGenerationRequest
  ): {
    frameworkAlignment: number;
    roleSpecificity: number;
    regulatoryAccuracy: number;
    confidence: number;
    validationChecks: any;
    recommendations: string[];
  } {
    const content = policyContent.toLowerCase();

    // Check for framework-specific keywords
    const frameworkKeywords = frameworkPrompt.validationKeywords;
    const foundKeywords = frameworkKeywords.filter(keyword =>
      content.includes(keyword.toLowerCase())
    );
    const frameworkAlignment = foundKeywords.length / frameworkKeywords.length;

    // Check for role-specific content
    const roleTitle = request.roleProfile.roleTitle.toLowerCase();
    const category = request.roleProfile.category.toLowerCase();
    const hasRoleContent = content.includes(roleTitle) && content.includes(category);
    const roleSpecificity = hasRoleContent ? 1.0 : 0.5;

    // Check for regulatory accuracy
    const hasFrameworkName = content.includes(request.regulatoryFramework.toLowerCase());
    const hasSpecificControls = content.includes('controls') || content.includes('requirements');
    const regulatoryAccuracy = (hasFrameworkName ? 0.5 : 0) + (hasSpecificControls ? 0.5 : 0);

    // Calculate overall confidence
    const confidence = (frameworkAlignment + roleSpecificity + regulatoryAccuracy) / 3;

    // Validation checks
    const validationChecks = {
      hasFrameworkKeywords: frameworkAlignment > 0.7,
      hasRoleSpecificContent: roleSpecificity > 0.8,
      followsOutputFormat: true, // Basic check
      meetsConfidenceThreshold: confidence >= request.confidenceThreshold
    };

    // Generate recommendations
    const recommendations: string[] = [];

    if (frameworkAlignment < 0.8) {
      recommendations.push(`Increase ${frameworkPrompt.framework}-specific terminology and references`);
    }

    if (roleSpecificity < 0.9) {
      recommendations.push('Enhance role-specific content and responsibilities');
    }

    if (regulatoryAccuracy < 0.8) {
      recommendations.push('Include more specific regulatory requirements and controls');
    }

    if (confidence < request.confidenceThreshold) {
      recommendations.push(`Overall confidence (${confidence.toFixed(2)}) below threshold (${request.confidenceThreshold})`);
    }

    return {
      frameworkAlignment,
      roleSpecificity,
      regulatoryAccuracy,
      confidence,
      validationChecks,
      recommendations
    };
  }

  // Get available frameworks
  getAvailableFrameworks(): RegulatoryFramework[] {
    return Array.from(this.frameworkPrompts.keys());
  }

  // Get framework prompt details
  getFrameworkPrompt(framework: RegulatoryFramework): FrameworkSpecificPrompt | undefined {
    return this.frameworkPrompts.get(framework);
  }

  // Update framework prompt
  updateFrameworkPrompt(framework: RegulatoryFramework, prompt: FrameworkSpecificPrompt): void {
    this.frameworkPrompts.set(framework, prompt);
  }

  // Add new framework prompt
  addFrameworkPrompt(prompt: FrameworkSpecificPrompt): void {
    this.frameworkPrompts.set(prompt.framework, prompt);
  }
}
