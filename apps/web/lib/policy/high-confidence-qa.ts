// High-Confidence Question Answering System
// Small Model + Structured Knowledge = High Confidence

import { EnhancedKnowledgeManager } from './enhanced-knowledge-manager';

export interface QARequest {
  question: string;
  frameworks?: string[];
  role?: string;
}

export interface QAResponse {
  success: boolean;
  answer: string;
  confidence: number;
  citations: string[];
}

export class HighConfidenceQA {
  private knowledgeManager: EnhancedKnowledgeManager;

  constructor() {
    this.knowledgeManager = new EnhancedKnowledgeManager();
    console.log('🚀 High-Confidence QA System initialized with Enhanced Knowledge Manager');
  }

  async answerQuestion(request: QARequest): Promise<QAResponse> {
    try {
      console.log(`🧠 Processing question: "${request.question}" with role: ${request.role}`);

      // Use the enhanced knowledge manager for role-specific responses
      const response = await this.generateRoleSpecificAnswer(request);

      return {
        success: true,
        answer: response.answer,
        confidence: response.confidence,
        citations: response.citations
      };

    } catch (error) {
      console.error(`❌ Error: ${error}`);
      return {
        success: false,
        answer: 'Unable to provide high-confidence response',
        confidence: 0.0,
        citations: []
      };
    }
  }

  private async generateRoleSpecificAnswer(request: QARequest): Promise<{
    answer: string;
    confidence: number;
    citations: string[];
  }> {
    const { question, frameworks, role } = request;

    // Use role-specific search if role is provided
    if (role) {
      const roleResults = await this.knowledgeManager.searchRoleSpecific(question, role, frameworks?.[0]);

      if (roleResults.semanticResults.length > 0) {
        const bestMatch = roleResults.semanticResults[0];
        const citations = roleResults.semanticResults
          .slice(0, 3)
          .map(result => result.chunk.metadata.framework || 'Unknown')
          .filter(Boolean);

        return {
          answer: `${bestMatch.chunk.text}\n\n${roleResults.sampleResponse ? `Sample Implementation: ${roleResults.sampleResponse}` : ''}`,
          confidence: roleResults.confidence,
          citations
        };
      }
    }

    // Fallback to general semantic search
    const results = await this.knowledgeManager.searchBySimilarity(question, 0.2);

    if (results.length > 0) {
      const bestMatch = results[0];
      const citations = results
        .slice(0, 3)
        .map(result => result.chunk.metadata.framework || 'Unknown')
        .filter(Boolean);

      return {
        answer: bestMatch.chunk.text,
        confidence: bestMatch.similarity,
        citations
      };
    }

    // Final fallback
    return {
      answer: `I couldn't find specific information about "${question}" in our knowledge base. Please try rephrasing your question or specify a different framework.`,
      confidence: 0.3,
      citations: []
    };
  }
}
