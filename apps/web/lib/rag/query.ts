// Phase 1 RAG improvements: Query preprocessing and result scoring
export function preprocessQuery(query: string) {
  const normalized = query.toLowerCase().trim();
  const keywords = normalized.split(/\s+/).filter(Boolean);
  const frameworks: string[] = [];

  // Smart framework detection
  if (/gdpr|privacy|data protection|general data protection/i.test(normalized)) frameworks.push("GDPR");
  if (/eu ai|artificial intelligence|ai systems|ai act/i.test(normalized)) frameworks.push("EU AI Act");
  if (/nis2|network security|cybersecurity|information security/i.test(normalized)) frameworks.push("NIS2");
  if (/nist|csf|cybersecurity framework/i.test(normalized)) frameworks.push("NIST CSF");
  if (/owasp|vulnerabilities|web security|top 10/i.test(normalized)) frameworks.push("OWASP");

  // Intent classification
  let intent: 'explain' | 'policy' | 'requirement' | 'risk' = 'explain';
  if (/policy|draft|should|must|shall|requirement/i.test(normalized)) intent = 'policy';
  if (/risk|impact|threat|vulnerability/i.test(normalized)) intent = 'risk';
  if (/how to|steps|procedure|process|implementation/i.test(normalized)) intent = 'requirement';

  // Clause detection (for ISO references like "A.5.1")
  const clauseMatch = Array.from((normalized.match(/\b(a|article)?\.?\s*\d{1,3}(\.\d+){0,2}\b/gi) || []));

  return {
    original: query,
    normalized,
    keywords,
    frameworks,
    intent,
    clauseMatch
  };
}

export function calculateRelevanceScore(query: string, result: any) {
  let score = 0;
  const q = query.toLowerCase();
  const text = (result.text_chunk || result.content || '').toLowerCase();
  const framework = (result.framework || '').toLowerCase();

  // Content relevance
  if (text.includes(q)) score += 0.4;

  // Framework relevance
  if (framework && q.includes(framework)) score += 0.3;

  // Keyword matching
  const queryWords = q.split(/\s+/).filter(w => w.length > 2);
  const matchedWords = queryWords.filter(word => text.includes(word));
  score += (matchedWords.length / queryWords.length) * 0.2;

  // Source quality bonus
  if (result.source_url && result.source_url.includes('eur-lex.europa.eu')) score += 0.1;

  return Math.min(score, 1.0); // Cap at 1.0
}

export function scoreResults(query: string, results: any[]) {
  return results
    .map((r) => ({
      ...r,
      score: calculateRelevanceScore(query, r),
    }))
    .sort((a, b) => b.score - a.score);
}

export function highlightRelevantParts(query: string, content: string) {
  if (!content) return content;

  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  let highlighted = content;

  queryWords.forEach(word => {
    const regex = new RegExp(`(${word})`, 'gi');
    highlighted = highlighted.replace(regex, '**$1**');
  });

  return highlighted;
}
