"use client";

import { useState } from "react";

export default function RagSearchPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);
    setResult(null);
    setDraft(null);

    try {
      const res = await fetch("/api/v1/rag/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const topResult = data.results[0];
        setResult(`📚 ${topResult.metadata?.title || 'Security Framework Result'}\n\n${topResult.metadata?.content || 'Content not available'}\n\nSimilarity Score: ${(topResult.similarity * 100).toFixed(1)}%`);
      } else {
        setResult("No results found. Try rephrasing your query.");
      }
    } catch (error) {
      setResult("Error searching frameworks. Please try again.");
    }
    
    setLoading(false);
  }

  async function handleDraftPolicy() {
    if (!query) return;

    try {
      const res = await fetch("/api/v1/ai/policy-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (data.policy) {
        setDraft(data.policy);
      } else {
        setDraft("No policy draft generated. Please try again.");
      }
    } catch (error) {
      setDraft("Error generating policy draft. Please try again.");
    }
  }

  async function handleSubmitForApproval() {
    if (!query || !draft) return;

    try {
      await fetch("/api/v1/policy/submit-approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, draft }),
      });

      alert("✅ Policy draft submitted for approval");
      // Reset form
      setQuery("");
      setResult(null);
      setDraft(null);
    } catch (error) {
      alert("❌ Error submitting for approval. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">🔎 Security Policy RAG Search</h1>

        <textarea
          className="w-full border rounded-lg p-2 mb-4"
          rows={3}
          placeholder="Ask: What does ISO 27001 require for key rotation?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search Frameworks"}
        </button>

        {result && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">📖 RAG Result:</h2>
            <p className="p-3 bg-gray-100 rounded-lg whitespace-pre-wrap">{result}</p>
          </div>
        )}

        {result && !draft && (
          <button
            onClick={handleDraftPolicy}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            ✍️ Draft Policy from Result
          </button>
        )}

        {draft && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">📝 Draft Policy:</h2>
            <p className="p-3 bg-yellow-50 rounded-lg whitespace-pre-wrap">{draft}</p>

            <button
              onClick={handleSubmitForApproval}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              ✅ Submit for Approval
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
