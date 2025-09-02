type TestCase = {
  name: string;
  query: string;
  role: string;
  framework?: string;
  expected_keywords?: string[];
  min_hits?: number;
  confidence_threshold?: number;
};

type ApiResponse = {
  success: boolean;
  response?: {
    success: boolean;
    answer: string;
    confidence: number;
    citations: string[];
  };
};

const ROLE_TOKENS: Record<string, string[]> = {
  ciso: ['governance', 'risk', 'board', 'audit', 'oversight', 'policy'],
  'product manager': ['roadmap', 'release', 'acceptance', 'sla', 'vendor'],
  developer: ['code', 'implement', 'ci/cd', 'config', 'library', 'tests'],
  'compliance officer': ['audit', 'evidence', 'documentation', 'mapping', 'conformity']
};

function includesAny(haystack: string, needles: string[]): boolean {
  const lower = haystack.toLowerCase();
  return needles.some(n => lower.includes(n.toLowerCase()));
}

async function runTest(host: string, tc: TestCase) {
  const body: any = { question: tc.query, role: tc.role };
  if (tc.framework) body.frameworks = [tc.framework];
  const res = await fetch(`${host}/api/v1/qa/high-confidence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = (await res.json()) as ApiResponse;
  const answer = json.response?.answer || '';
  const citations = json.response?.citations || [];
  const confidence = json.response?.confidence ?? 0;

  // Checks
  const roleKey = (tc.role || '').toLowerCase();
  const roleTokens = ROLE_TOKENS[roleKey] || [];
  const role_check = roleTokens.length === 0 ? true : includesAny(answer, roleTokens);
  const framework_check = tc.framework ? citations.map(c => c.toLowerCase()).some(c => c.includes(tc.framework!.toLowerCase())) : true;
  const keyword_check = (tc.expected_keywords && tc.expected_keywords.length > 0) ? includesAny(answer, tc.expected_keywords) : true;
  const confidence_threshold = tc.confidence_threshold ?? 0.75;
  const confidence_check = confidence >= confidence_threshold;

  const pass = role_check && framework_check && keyword_check && confidence_check;
  const status = pass ? '✅' : '❌';
  const detail = `framework:${framework_check ? 'OK' : 'FAIL'}, role:${role_check ? 'OK' : 'FAIL'}, keywords:${keyword_check ? 'OK' : 'FAIL'}, conf:${confidence.toFixed(2)}${confidence_check ? '' : ' (<)'} `;
  console.log(`${status} ${tc.name} ${tc.framework ? `[${tc.framework}]` : ''} → ${detail}`);
  if (!pass) {
    console.log(`   ↳ citations: ${citations.join(', ')}`);
    console.log(`   ↳ answer: ${answer.split('\n').slice(0, 2).join(' / ')}...`);
  }
  return pass;
}

async function main() {
  const corpusPath = process.argv[2] || 'tests/retrieval-corpus.json';
  const host = process.argv[3] || process.env.TEST_HOST || 'http://localhost:3000';
  // Read corpus from filesystem (avoid file:// fetch issues)
  const fs = await import('fs');
  const text = fs.readFileSync(corpusPath, 'utf-8');
  const cases = JSON.parse(text) as TestCase[];
  let passed = 0;
  for (const tc of cases) {
    try {
      const ok = await runTest(host, tc);
      if (ok) passed++;
    } catch (e) {
      console.log(`❌ ${tc.name} errored:`, (e as Error).message);
    }
  }
  console.log(`\nSummary: ${passed}/${cases.length} passed`);
  process.exit(passed === cases.length ? 0 : 1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});


