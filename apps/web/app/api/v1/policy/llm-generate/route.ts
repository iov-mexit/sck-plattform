// LLM Policy Generation API Endpoint
// Tests the new LLM-powered system vs old template approach

import { NextRequest, NextResponse } from 'next/server';
import { LLMPolicyGenerator, LLMPolicyRequest } from '../../../../../lib/policy/llm-policy-generator';
import { UnifiedPolicySystem } from '../../../../../lib/policy/unified-policy-system';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      regulatoryFramework,
      roleTitle,
      roleCategory,
      specificRequirement,
      confidenceThreshold = 0.7,
      context,
      useUnified = false
    } = body;

    if (!regulatoryFramework || !roleTitle || !roleCategory || !specificRequirement) {
      return NextResponse.json(
        { error: 'Missing required fields: regulatoryFramework, roleTitle, roleCategory, specificRequirement' },
        { status: 400 }
      );
    }

    console.log('🚀 LLM Policy Generation Request:', {
      regulatoryFramework,
      roleTitle,
      roleCategory,
      specificRequirement,
      confidenceThreshold,
      context,
      useUnified
    });

    if (useUnified) {
      // Use the unified system (recommended)
      const unifiedSystem = new UnifiedPolicySystem();

      // Create a mock role template for testing
      const mockRoleTemplate = {
        id: 'test-role',
        title: roleTitle,
        category: roleCategory,
        responsibilities: [`Implement ${specificRequirement} controls`],
        securityContributions: ['Security implementation', 'Compliance monitoring'],
        riskProfile: 'MEDIUM'
      };

      const result = await unifiedSystem.generateUnifiedPolicy({
        roleTemplate: mockRoleTemplate,
        regulatoryFramework,
        specificRequirement,
        confidenceThreshold,
        context
      });

      return NextResponse.json({
        success: true,
        message: 'LLM-powered unified policy generated successfully!',
        result,
        system: 'unified-llm'
      });

    } else {
      // Use direct LLM generator
      const llmGenerator = new LLMPolicyGenerator();

      const llmRequest: LLMPolicyRequest = {
        regulatoryFramework,
        roleTitle,
        roleCategory,
        specificRequirement,
        confidenceThreshold,
        context
      };

      const result = await llmGenerator.generateLLMPolicy(llmRequest);

      return NextResponse.json({
        success: true,
        message: 'LLM-powered policy generated successfully!',
        result,
        system: 'direct-llm'
      });
    }

  } catch (error) {
    console.error('❌ LLM Policy Generation Error:', error);

    return NextResponse.json(
      {
        error: 'Policy generation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        system: 'llm-powered'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'LLM Policy Generation API',
    endpoints: {
      POST: '/api/v1/policy/llm-generate',
      description: 'Generate LLM-powered policies with few-shot training'
    },
    supportedFrameworks: ['OWASP', 'GDPR', 'NIS2', 'NIST_CSF', 'EU_AI_ACT'],
    features: [
      'Real LLM generation (not string templating)',
      'Framework-specific system prompts',
      'High-quality few-shot examples',
      'Professional-grade security documentation',
      'Real-time confidence assessment'
    ],
    usage: {
      method: 'POST',
      body: {
        regulatoryFramework: 'OWASP|GDPR|NIS2|NIST_CSF|EU_AI_ACT',
        roleTitle: 'L3 Security Engineer',
        roleCategory: 'Architecture',
        specificRequirement: 'Access Control',
        confidenceThreshold: 0.7,
        context: 'Web application security',
        useUnified: false
      }
    }
  });
}
