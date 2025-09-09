"use client";
import { useState } from "react";

interface SearchResult {
  id: string;
  framework: string;
  highlights: string;
  text_chunk: string;
  source_url: string;
  score: number;
}

export default function RagSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResults([]);
    setMessage(null);

    try {
      const res = await fetch("/api/rag/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.results && data.results.length > 0) {
        setResults(data.results);
        setMessage(`Found ${data.results.length} results using ${data.usedMode} search`);
      } else {
        setMessage(data.message || "No results found. Try rephrasing your query.");
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDraftPolicy = async (result: SearchResult) => {
    try {
      const res = await fetch("/api/ai/policy-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          framework: result.framework,
          reference: result.text_chunk,
          source: result.source_url,
          highlights: result.highlights,
          query: query
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setMessage(`✅ Policy draft created! ID: ${data.draftId}`);

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);

    } catch (error: any) {
      setMessage(`❌ Failed to create policy draft: ${error.message}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <span className="text-sm text-gray-500">• Regulatory Knowledge Search</span>
          </div>
          <h1 className="text-5xl font-bold text-black leading-tight mb-6">
            <span className="block">RAG Search</span>
            <span className="block">Engine</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Search across GDPR, EU AI Act, NIS2, NIST CSF, and OWASP frameworks with intelligent semantic search
          </p>
        </div>

        {/* Search Input */}
        <div className="bg-white border border-gray-100 rounded-lg p-8 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              className="flex-1 border-2 border-gray-200 rounded-xl p-4 text-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Ask about ISO 27001, GDPR compliance, AI risk assessment..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
            >
              {loading ? "🔍 Searching..." : "Search"}
            </button>
          </div>

          {/* Search Tips */}
          <div className="mt-4 text-sm text-gray-500">
            💡 Try queries like: "GDPR data protection", "EU AI Act compliance", "NIST cybersecurity framework"
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              📖 Search Results ({results.length})
            </h2>

            {results.map((result, index) => (
              <div key={result.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {result.framework}
                      </span>
                      <span className="text-sm text-gray-500">
                        Score: {(result.score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <button
                      onClick={() => handleDraftPolicy(result)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      ✍️ Draft Policy
                    </button>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Content:</h3>
                    <div className="bg-gray-50 rounded-lg p-4 text-gray-800 whitespace-pre-wrap">
                      {result.text_chunk}
                    </div>
                  </div>

                  {/* Highlights */}
                  {result.highlights && result.highlights !== result.text_chunk && (
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-900 mb-2">Relevant Highlights:</h3>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-gray-800">
                        {result.highlights}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <a
                      href={result.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
                    >
                      🔗 View Source
                      <span className="text-xs">({result.source_url})</span>
                    </a>
                    <span className="text-xs text-gray-500">
                      Result #{index + 1}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results State */}
        {!loading && results.length === 0 && query && !message && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600 mb-4">
              Try rephrasing your query or using different keywords.
            </p>
            <div className="text-sm text-gray-500">
              💡 Example queries: "data protection", "cybersecurity", "AI compliance"
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
