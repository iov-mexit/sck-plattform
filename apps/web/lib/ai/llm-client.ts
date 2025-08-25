type GenerateOpts = {
  system?: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
};

export async function llmGenerate(opts: GenerateOpts): Promise<{ text: string; meta: any }> {
  const provider = (process.env.LLM_PROVIDER || "none").toLowerCase();
  const model = opts.model || process.env.LLM_MODEL || "llama3.1:8b-instruct";

  if (provider === "none") {
    // Safe default: deterministic template
    const text = `SAFE_MODE_ACTIVE: No LLM configured. Provide concise, structured rationale using the citations provided.`;
    return { text, meta: { provider, model, safe: true } };
  }

  if (provider === "openai") {
    const key = process.env.OPENAI_API_KEY!;
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        temperature: opts.temperature ?? 0.2,
        max_tokens: opts.maxTokens ?? 500,
        messages: [
          ...(opts.system ? [{ role: "system", content: opts.system }] : []),
          { role: "user", content: opts.prompt }
        ]
      })
    });
    const json = await res.json();
    const text = json.choices?.[0]?.message?.content ?? "";
    return { text, meta: { provider, model, usage: json.usage } };
  }

  if (provider === "ollama") {
    const base = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    const res = await fetch(`${base}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt: (opts.system ? `${opts.system}\n\n` : "") + opts.prompt,
        options: { temperature: opts.temperature ?? 0.2 }
      })
    });
    const text = await streamToString(res.body as any);
    return { text, meta: { provider, model } };
  }

  if (provider === "vllm") {
    const base = process.env.VLLM_BASE_URL || "http://localhost:8000";
    const res = await fetch(`${base}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        temperature: opts.temperature ?? 0.2,
        max_tokens: opts.maxTokens ?? 500,
        messages: [
          ...(opts.system ? [{ role: "system", content: opts.system }] : []),
          { role: "user", content: opts.prompt }
        ]
      })
    });
    const json = await res.json();
    const text = json.choices?.[0]?.message?.content ?? "";
    return { text, meta: { provider, model } };
  }

  return { text: "Unsupported LLM provider", meta: { provider, model, error: true } };
}

async function streamToString(stream: ReadableStream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    result += decoder.decode(value);
  }
  return result;
}
