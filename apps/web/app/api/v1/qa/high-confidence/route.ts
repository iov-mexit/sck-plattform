// High-Confidence QA API Endpoint
// Tests the structured knowledge + small model system

import { NextRequest, NextResponse } from 'next/server';
import { HighConfidenceQA } from '../../../../../lib/policy/high-confidence-qa';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, frameworks } = body;

    if (!question) {
      return NextResponse.json(
        { error: 'Missing question parameter' },
        { status: 400 }
      );
    }

    console.log('🧠 High-Confidence QA Request:', { question, frameworks });

    const qaSystem = new HighConfidenceQA();
    const response = await qaSystem.answerQuestion({ question, frameworks });

    console.log(`✅ High-confidence response generated (confidence: ${response.confidence})`);

    return NextResponse.json({
      success: true,
      message: 'High-confidence response generated successfully!',
      response,
      system: 'high-confidence-qa'
    });

  } catch (error) {
    console.error('❌ High-Confidence QA Error:', error);

    return NextResponse.json(
      {
        error: 'Question answering failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        system: 'high-confidence-qa'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'High-Confidence QA System',
    endpoints: {
      POST: '/api/v1/qa/high-confidence',
      description: 'Get high-confidence answers to regulatory questions'
    },
    features: [
      'Structured knowledge base (OWASP, GDPR, NIS2)',
      'High-confidence responses (0.95+)',
      'Official source citations',
      'Small model integration',
      'No low-confidence outputs'
    ],
    usage: {
      method: 'POST',
      body: {
        question: 'What are the OWASP Top 10 vulnerabilities?',
        frameworks: ['owasp-top10-2021']
      }
    },
    confidence: {
      threshold: '0.95+ (Never output low confidence)',
      sources: 'Official regulatory documentation',
      validation: 'Structured knowledge + confidence scoring'
    }
  });
}
