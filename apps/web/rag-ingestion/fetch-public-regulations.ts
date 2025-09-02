import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

interface EnhancedKnowledgeChunk {
  id: string;
  text: string;
  chunkType: string;
  metadata: {
    language: string;
    confidence: number;
    source: string;
    canonical?: string;
    article?: string;
    jurisdiction?: string;
    framework?: string;
    concepts?: string[];
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    targetRoles?: string[];
    lastUpdated?: string;
    roleSpecificRelevance?: string[];
  };
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.text();
}

function chunkify(text: string, opts: { framework: string; source: string; role: string; concepts: string[]; jurisdiction?: string }): EnhancedKnowledgeChunk[] {
  const maxLen = 800;
  const parts: string[] = [];
  let remaining = text.replace(/\s+/g, ' ').trim();
  while (remaining.length > 0) {
    parts.push(remaining.slice(0, maxLen));
    remaining = remaining.slice(maxLen);
  }
  return parts.map((p, idx) => ({
    id: `${opts.framework}-${opts.role}-${Date.now()}-${idx}`,
    text: p,
    chunkType: 'LAW_TEXT_SNIPPET',
    metadata: {
      language: 'en',
      confidence: 0.9,
      source: opts.source,
      framework: opts.framework,
      concepts: opts.concepts,
      difficulty: 'intermediate',
      targetRoles: [opts.role],
      jurisdiction: opts.jurisdiction,
      lastUpdated: new Date().toISOString(),
      roleSpecificRelevance: []
    }
  }));
}

async function main() {
  const outDir = path.resolve(process.cwd(), 'apps/web/rag-ingestion/cleaned-data/role_chunks');
  fs.mkdirSync(outDir, { recursive: true });

  const targets = [
    {
      framework: 'eu-ai-act-2024',
      url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj',
      source: 'EUR-Lex EU AI Act',
      jurisdiction: 'EU',
      roles: [
        { role: 'developer', concepts: ['risk assessment', 'technical documentation', 'transparency', 'logging'] },
        { role: 'security engineer', concepts: ['risk management', 'monitoring', 'post-market'] },
        { role: 'product manager', concepts: ['documentation', 'disclosure', 'user transparency'] }
      ]
    },
    {
      framework: 'nis2-2023',
      url: 'https://www.enisa.europa.eu/publications/nis2-technical-implementation-guidance',
      source: 'ENISA NIS2 Guidance',
      jurisdiction: 'EU',
      roles: [
        { role: 'developer', concepts: ['logging', 'incident reporting', 'access control'] },
        { role: 'security engineer', concepts: ['incident detection', 'monitoring', 'response'] },
        { role: 'product manager', concepts: ['reporting timelines', 'supply chain'] }
      ]
    }
  ];

  for (const t of targets) {
    try {
      const html = await fetchText(t.url);
      for (const r of t.roles) {
        const chunks = chunkify(html, { framework: t.framework, source: t.source, role: r.role, concepts: r.concepts, jurisdiction: t.jurisdiction });
        const file = path.join(outDir, `${t.framework}-${r.role}.json`);
        fs.writeFileSync(file, JSON.stringify(chunks, null, 2));
        console.log(`Wrote ${chunks.length} chunks -> ${file}`);
      }
    } catch (e) {
      console.error(`Failed processing ${t.framework}:`, e);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
