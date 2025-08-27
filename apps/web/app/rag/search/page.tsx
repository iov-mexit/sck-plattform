"use client";

import { useState, useEffect } from "react";

type RagResult = {
  id: string;
  similarity: number;
  metadata: {
    title?: string;
    source?: string;
    content?: string;
    tags?: string[];
  };
};

export default function RagSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RagResult[]>([]);
  const [resultMsg, setResultMsg] = useState<string | null>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Debug logging for state changes
  useEffect(() => {
    console.log("🔄 Results state changed:", results);
    console.log("🔄 Results length:", results.length);
    console.log("🔄 Results array type:", Array.isArray(results));
  }, [results]);

  useEffect(() => {
    console.log("🔄 ResultMsg state changed:", resultMsg);
  }, [resultMsg]);

  useEffect(() => {
    console.log("🔄 Loading state changed:", loading);
  }, [loading]);

  async function handleSearch() {
    setLoading(true);
    setResults([]);
    setResultMsg(null);
    setDraft(null);

    try {
      console.log("🔍 Starting search for:", query);

      // Try relative path first, fallback to full URL if needed
      let apiUrl = "/api/v1/rag/search";
      if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        // In production, ensure we have the full URL
        apiUrl = `${window.location.origin}/api/v1/rag/search`;
      }

      console.log("🌐 Using API URL:", apiUrl);
      console.log("📤 Request payload:", { query });
      console.log("📤 Request headers:", { "Content-Type": "application/json" });

      // Use GET endpoint with query params since POST seems to have issues
      const getUrl = `${apiUrl}?query=${encodeURIComponent(query)}&topK=5`;
      console.log("🌐 GET URL:", getUrl);
      
      // Add more headers to match curl behavior
      const headers = {
        "Content-Type": "application/json",
        "User-Agent": "SCK-Frontend/1.0",
        "Accept": "application/json"
      };
      console.log("📤 Request headers:", headers);
      
      // Test: Make the exact same request as curl
      console.log("🧪 Testing exact curl request...");
      const testRes = await fetch(getUrl, { method: "GET" });
      const testData = await testRes.text();
      console.log("🧪 Test response:", testData);
      
      const res = await fetch(getUrl, {
        method: "GET",
        headers: headers,
      });

      console.log("📡 Response received:");
      console.log("  - Status:", res.status);
      console.log("  - Status Text:", res.statusText);
      console.log("  - Headers:", Object.fromEntries(res.headers.entries()));
      console.log("  - OK:", res.ok);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const responseText = await res.text();
      console.log("📄 Raw response text:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log("📊 Parsed JSON data:", data);
      } catch (parseError) {
        console.error("💥 JSON parse error:", parseError);
        throw new Error(`Failed to parse response: ${parseError.message}`);
      }

      console.log("🔍 Data validation:");
      console.log("  - Has results property:", 'results' in data);
      console.log("  - Results is array:", Array.isArray(data.results));
      console.log("  - Results length:", data.results?.length);
      console.log("  - Full data structure:", data);

      if (Array.isArray(data?.results) && data.results.length > 0) {
        console.log("✅ Setting results array with", data.results.length, "items");
        setResults(data.results);
        console.log("✅ Results state updated");
      } else {
        console.log("❌ No valid results array found");
        console.log("  - data.results:", data.results);
        console.log("  - Array.isArray(data.results):", Array.isArray(data.results));
        console.log("  - data.results?.length:", data.results?.length);
        setResultMsg("No results found. Try rephrasing your query.");
      }
    } catch (error) {
      console.error("💥 Search error occurred:", error);
      console.error("💥 Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      setResultMsg(`Error searching frameworks: ${error.message}`);
    } finally {
      console.log("🏁 Search function completed");
      setLoading(false);
    }
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
      setResults([]);
      setResultMsg(null);
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

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">📖 RAG Result:</h2>

          {results.length > 0 ? (
            <div className="space-y-3">
              {results.slice(0, 5).map((r) => (
                <div key={r.id} className="p-3 bg-gray-100 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">{r.metadata?.source} • {r.id} • {(r.similarity * 100).toFixed(1)}%</div>
                  <div className="font-medium">{r.metadata?.title || "Result"}</div>
                  <div className="text-gray-800 whitespace-pre-wrap">
                    {r.metadata?.content}
                  </div>
                  {r.metadata?.tags?.length ? (
                    <div className="mt-2 text-xs text-gray-600">
                      Tags: {r.metadata.tags.join(", ")}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="p-3 bg-gray-100 rounded-lg">{resultMsg || "No results yet. Try a query."}</p>
          )}
        </div>

        {results.length > 0 && !draft && (
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
