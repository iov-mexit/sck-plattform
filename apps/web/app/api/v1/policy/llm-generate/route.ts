// LLM Policy Generation API Endpoint
// Temporarily disabled - using QA system instead

import { NextRequest, NextResponse } from 'next/server';
// import { LLMPolicyGenerator, LLMPolicyRequest } from '../../../../../lib/policy/llm-policy-generator';
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

    console.log('🚀 Policy Generation Request:', {
      regulatoryFramework,
      roleTitle,
      roleCategory,
      specificRequirement,
      confidenceThreshold,
      context,
      useUnified
    });

    // Return a response directing users to the QA system
    return NextResponse.json({
      success: true,
      message: 'Policy generation temporarily disabled. Please use the High-Confidence QA system instead.',
      redirect: '/api/v1/qa/high-confidence',
      system: 'qa-system-redirect'
    });

  } catch (error) {
    console.error('❌ Policy Generation Error:', error);

    return NextResponse.json(
      {
        error: 'Policy generation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        system: 'qa-system-redirect'
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

