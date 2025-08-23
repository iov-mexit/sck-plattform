'use client';

import { useState } from 'react';

export default function AiStatusPage() {
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  async function testDraft() {
    setLoading(true); setErr(null); setResp(null);
    try {
      const r = await fetch('/api/ai/policy-draft', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
          artifact: { type: 'MCP', id: 'demo-mcp-1' },
          goal: 'Draft baseline access policy for critical MCP',
          riskHint: 'high'
        })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'Request failed');
      setResp(j);
    } catch (e: any) {
      setErr(e?.message || 'unknown');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">AI Status</h1>
      <div className="flex gap-2">
        <span>LLM_PROVIDER: {process.env.NEXT_PUBLIC_LLM_PROVIDER || process.env.LLM_PROVIDER}</span>
      </div>
      <button
        className="px-4 py-2 rounded-lg bg-black text-white"
        onClick={testDraft}
        disabled={loading}
      >
        {loading ? 'Testing…' : 'Test Policy Draft'}
      </button>
      {err && <pre className="text-red-600 whitespace-pre-wrap">{err}</pre>}
      {resp && (
        <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-auto">
{JSON.stringify(resp, null, 2)}
        </pre>
      )}
      <p className="text-sm text-gray-500">
        Tip: If provider is <code>ollama</code>, ensure <code>ollama serve</code> is running and model is pulled.
      </p>
    </div>
  );
}
