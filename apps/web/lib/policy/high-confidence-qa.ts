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
    // Wait for the knowledge manager to be fully initialized
    if (this.knowledgeManager.initializationComplete) {
      this.knowledgeManager.initializationComplete.then(() => {
        console.log('✅ Enhanced Knowledge Manager fully initialized');
      }).catch(err => {
        console.error('❌ Enhanced Knowledge Manager initialization failed:', err);
      });
    }
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

      if (roleResults.semanticResults.length > 0 || roleResults.unfilteredSemanticResults.length > 0) {
        // Prioritize framework-specific results if framework is specified
        // Prefer role-filtered list; if empty, use unfiltered for framework fallback
        let candidateList = roleResults.semanticResults.length > 0 ? roleResults.semanticResults : roleResults.unfilteredSemanticResults;

        // Role-intent boosting: give a small boost when chunk text reflects role vocabulary
        const ROLE_TOKENS: Record<string, string[]> = {
          ciso: ['governance', 'risk', 'board', 'audit', 'oversight', 'policy'],
          'product manager': ['roadmap', 'release', 'acceptance', 'sla', 'vendor'],
          developer: ['code', 'implement', 'ci/cd', 'config', 'library', 'tests'],
          'compliance officer': ['audit', 'evidence', 'documentation', 'mapping', 'conformity']
        };
        const roleKey = (role || '').toLowerCase();
        const roleTokens = ROLE_TOKENS[roleKey] || [];

        const boostedByRole = candidateList.map(r => {
          const text = (r.chunk.text || '').toLowerCase();
          const hasRoleSignal = roleTokens.some(t => text.includes(t));
          const bonus = hasRoleSignal ? 0.05 : 0;
          return { ...r, similarity: Math.min(1, r.similarity + bonus) };
        });

        let bestMatch = boostedByRole[0];

        if (frameworks && frameworks.length > 0) {
          console.log(`🔍 Framework prioritization: Looking for frameworks: ${frameworks.join(', ')}`);
          const frameworkSpecificResults = boostedByRole.filter(result =>
            frameworks.some(framework => {
              const chunkFramework = result.chunk.metadata.framework?.toLowerCase() || '';
              const requestedFramework = framework.toLowerCase();
              // Match exact framework or framework with version suffix
              const matches = chunkFramework === requestedFramework ||
                chunkFramework.includes(requestedFramework) ||
                chunkFramework.startsWith(requestedFramework + '-');
              console.log(`   ${result.chunk.id}: ${chunkFramework} vs ${requestedFramework} = ${matches}`);
              return matches;
            })
          );

          console.log(`✅ Found ${frameworkSpecificResults.length} framework-specific results`);

          if (frameworkSpecificResults.length > 0) {
            // Apply a stronger boost to ensure requested framework wins near-ties
            const boosted = frameworkSpecificResults.map(r => ({
              ...r,
              similarity: Math.min(1, r.similarity + 0.15)
            }));
            boosted.sort((a, b) => b.similarity - a.similarity);
            bestMatch = boosted[0];
          } else {
            // If none matched exactly, softly prefer chunks whose framework metadata contains any requested framework token
            const softMatches = boostedByRole.map(r => {
              const cf = (r.chunk.metadata.framework || '').toLowerCase();
              const hasToken = frameworks.some(fw => cf.includes(fw.toLowerCase()));
              const bonus = hasToken ? 0.08 : 0;
              return { ...r, similarity: Math.min(1, r.similarity + bonus) };
            });
            softMatches.sort((a, b) => b.similarity - a.similarity);
            bestMatch = softMatches[0];
          }
        }

        // Ensure citations include requested framework if provided
        let citationsSource = boostedByRole;
        if (frameworks && frameworks.length > 0) {
          const matched = boostedByRole.filter(r => frameworks.some(fw => (r.chunk.metadata.framework || '').toLowerCase().includes(fw.toLowerCase())));
          if (matched.length > 0) {
            citationsSource = matched.concat(boostedByRole).slice(0, 5);
          }
        }

        const citations = citationsSource
          .slice(0, 3)
          .map(result => result.chunk.metadata.framework || 'Unknown')
          .filter(Boolean);

        // Add advisory note if requested framework differs from selected best match
        let advisoryNote = '';
        if (frameworks && frameworks.length > 0) {
          const selectedFramework = (bestMatch.chunk.metadata.framework || '').toLowerCase();
          const requested = frameworks.map(f => f.toLowerCase());
          const matchesRequested = requested.some(r => selectedFramework.includes(r));
          if (!matchesRequested) {
            const requestedLabel = frameworks[0];
            advisoryNote = `Note: You requested guidance for ${requestedLabel}. Some content may be more impactful under ${requestedLabel} for the ${role} role. Consider refining your question with specifics (e.g., documentation, logging, risk assessment) to prioritize ${requestedLabel}.`;
          }
        }

        const finalAnswer = [
          bestMatch.chunk.text,
          roleResults.sampleResponse ? `Sample Implementation: ${roleResults.sampleResponse}` : '',
          advisoryNote
        ].filter(Boolean).join('\n\n');

        return {
          answer: finalAnswer,
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
