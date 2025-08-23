// Minimal, server-side only.
// Provider: 'ollama' (preferred local) or 'stub' (always returns safe canned output)

type LLMProvider = 'ollama' | 'stub';

const provider = (process.env.LLM_PROVIDER as LLMProvider) || 'stub';
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function llmChat(messages: LLMMessage[]): Promise<string> {
  if (provider === 'ollama') {
    try {
      const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.1:8b-instruct', // change to your local model tag
          messages,
          stream: false,
          options: { temperature: 0.2 }
        })
      });
      if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
      const data = await res.json();
      return data?.message?.content ?? '[empty]';
    } catch (e) {
      // Fall through to stub if Ollama not available
      console.warn('LLM(ollama) failed, falling back to stub:', e);
    }
  }

  // STUB OUTPUT (deterministic, safe)
  const lastUser = [...messages].reverse().find(m => m.role === 'user')?.content ?? '';
  return `STUB_DRAFT:
- policy.rego: |
    package mcp.policy

    default allow = false

    # Example: require LoA >= 3 for MCP 'critical' artifacts
    allow {
      input.artifact.type == "MCP"
      input.artifact.risk_score >= 0.7
      input.requested_loa >= 3
    }
- suggestedLoA: 3
- rationale: "Based on requested artifact type and risk, require LoA 3."
- citations: ["doc:example-iso27001-2022", "doc:eu-ai-act-overview"]
- echo: ${JSON.stringify(lastUser).slice(0, 180)}...`;
}
