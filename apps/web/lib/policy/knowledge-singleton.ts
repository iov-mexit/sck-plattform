import { EnhancedKnowledgeManager } from './enhanced-knowledge-manager';

let singleton: EnhancedKnowledgeManager | null = null;

export function getKnowledgeManager(): EnhancedKnowledgeManager {
  if (!singleton) {
    singleton = new EnhancedKnowledgeManager();
  }
  return singleton;
}


