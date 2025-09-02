import fs from 'fs';
import path from 'path';

type RoleBlock = {
  phrasing: string;
  policyGuidance: string;
};

type KnowledgeChunk = {
  id?: string;
  requirementId?: string;
  requirementName: string;
  coreDescription: string;
  roles: {
    Developer?: RoleBlock;
    ProductManager?: RoleBlock;
    ComplianceOfficer?: RoleBlock;
    CISO?: RoleBlock;
  };
  crossReferences?: string[];
  metadata?: Record<string, unknown>;
  sourceUrl?: string | string[];
  embedding?: number[];
};

type InputDataset = {
  knowledgeChunks: KnowledgeChunk[];
};

function inferFrameworkFromId(id: string | undefined): string | undefined {
  if (!id) return undefined;
  if (id.startsWith('owasp-web-')) return 'owasp-top10-2021';
  if (id.startsWith('owasp-api-')) return 'owasp-api-top10-2023';
  if (id.startsWith('owasp-llm-')) return 'owasp-llm-top10-2024';
  if (id.startsWith('iso27001-')) return 'iso-27001-2022';
  if (id.startsWith('dora-')) return 'dora-2024';
  if (id.startsWith('nis2-')) return 'nis2-2023';
  if (id.startsWith('cra-')) return 'cra-2024';
  if (id.startsWith('iso42001-')) return 'iso-42001-2023';
  if (id.startsWith('ai-act-') || id.startsWith('ai-act')) return 'eu-ai-act-2024';
  return undefined;
}

function buildSourceUrls(chunk: KnowledgeChunk): string[] {
  const urls: string[] = [];
  const id = chunk.id || chunk.requirementId || '';
  const framework = inferFrameworkFromId(id);

  // OWASP
  if (framework === 'owasp-top10-2021') urls.push('https://owasp.org/Top10/');
  if (framework === 'owasp-api-top10-2023') urls.push('https://owasp.org/API-Security/editions/2023/en/0x00-notice/');
  if (framework === 'owasp-llm-top10-2024') urls.push('https://owasp.org/www-project-top-10-for-large-language-model-applications/');

  // ISO 27001 (generic portal)
  if (framework === 'iso-27001-2022') urls.push('https://www.iso.org/standard/27001');

  // DORA (ESAs info portal)
  if (framework === 'dora-2024') urls.push('https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/digital-operational-resilience-act-dora');

  // NIS2 (ENISA guidance)
  if (framework === 'nis2-2023') urls.push('https://www.enisa.europa.eu/publications/nis2-technical-implementation-guidance');

  // CRA
  if (framework === 'cra-2024') urls.push('https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng');

  // ISO 42001
  if (framework === 'iso-42001-2023') urls.push('https://www.iso.org/standard/42001');

  // EU AI Act
  if (framework === 'eu-ai-act-2024') urls.push('https://eur-lex.europa.eu/eli/reg/2024/1689/oj');

  // Add crossReference-derived URLs where obvious
  (chunk.crossReferences || []).forEach(ref => {
    const norm = ref.toLowerCase();
    if (norm.startsWith('owasp')) {
      if (!urls.includes('https://owasp.org/Top10/')) urls.push('https://owasp.org/Top10/');
    } else if (norm.startsWith('iso27001')) {
      if (!urls.includes('https://www.iso.org/standard/27001')) urls.push('https://www.iso.org/standard/27001');
    } else if (norm.startsWith('dora')) {
      if (!urls.includes('https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/digital-operational-resilience-act-dora')) urls.push('https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/digital-operational-resilience-act-dora');
    } else if (norm.startsWith('nis2')) {
      if (!urls.includes('https://www.enisa.europa.eu/publications/nis2-technical-implementation-guidance')) urls.push('https://www.enisa.europa.eu/publications/nis2-technical-implementation-guidance');
    } else if (norm.startsWith('cra')) {
      if (!urls.includes('https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng')) urls.push('https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng');
    } else if (norm.startsWith('iso42001')) {
      if (!urls.includes('https://www.iso.org/standard/42001')) urls.push('https://www.iso.org/standard/42001');
    } else if (norm.includes('ai-act')) {
      if (!urls.includes('https://eur-lex.europa.eu/eli/reg/2024/1689/oj')) urls.push('https://eur-lex.europa.eu/eli/reg/2024/1689/oj');
    }
  });

  return urls;
}

function toJsonlLines(chunks: KnowledgeChunk[]): string[] {
  return chunks.map((raw) => {
    const id = raw.id || raw.requirementId;
    const enriched: KnowledgeChunk = {
      ...raw,
      id,
      requirementId: raw.requirementId || id,
      sourceUrl: raw.sourceUrl && raw.sourceUrl.length ? raw.sourceUrl : buildSourceUrls(raw),
      embedding: Array.isArray(raw.embedding) ? raw.embedding : []
    };
    return JSON.stringify(enriched);
  });
}

function main() {
  const input = process.argv[2];
  const output = process.argv[3];
  if (!input || !output) {
    console.error('Usage: ts-node json_to_jsonl.ts <input.json|jsonl> <output.jsonl>');
    process.exit(1);
  }

  const absIn = path.resolve(process.cwd(), input);
  const absOut = path.resolve(process.cwd(), output);

  const data = fs.readFileSync(absIn, 'utf-8');

  // If file already looks like JSONL, just enrich line-by-line
  if (data.trim().includes('\n') && !data.trim().startsWith('{')) {
    const lines = data.split(/\r?\n/).filter(Boolean);
    const parsed: KnowledgeChunk[] = lines.map(l => JSON.parse(l));
    const jsonl = toJsonlLines(parsed).join('\n') + '\n';
    fs.writeFileSync(absOut, jsonl);
    console.log(`Wrote ${parsed.length} enriched JSONL lines -> ${absOut}`);
    return;
  }

  // Parse JSON (expects { knowledgeChunks: [...] } or an array)
  const parsed = JSON.parse(data) as InputDataset | KnowledgeChunk[];
  const chunks: KnowledgeChunk[] = Array.isArray(parsed)
    ? parsed
    : (parsed.knowledgeChunks || []);

  const jsonl = toJsonlLines(chunks).join('\n') + '\n';
  fs.writeFileSync(absOut, jsonl);
  console.log(`Wrote ${chunks.length} enriched JSONL lines -> ${absOut}`);
}

main();


