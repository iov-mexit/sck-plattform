'use client';

import { useState } from 'react';
import { Search, Shield, ArrowRight, Copy, CheckCircle } from 'lucide-react';

interface SearchResponse {
  success: boolean;
  answer: string;
  confidence: number;
  citations: string[];
  roleGuidance?: any;
  sampleResponse?: string;
}

export default function PolicySearchPage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [selectedRole, setSelectedRole] = useState('product manager');
  const [selectedFramework, setSelectedFramework] = useState('all');
  const [copied, setCopied] = useState(false);

  const frameworks = [
    { id: 'all', name: 'All Frameworks' },
    { id: 'iso-27001', name: 'ISO 27001' },
    { id: 'owasp', name: 'OWASP Top 10' },
    { id: 'gdpr', name: 'GDPR' },
    { id: 'nis2', name: 'NIS2' },
    { id: 'dora', name: 'DORA' },
    { id: 'cra', name: 'CRA' },
    { id: 'iso-42001', name: 'ISO 42001' }
  ];

  const roles = [
    { id: 'product manager', name: 'Product Manager' },
    { id: 'developer', name: 'Developer' },
    { id: 'security engineer', name: 'Security Engineer' },
    { id: 'compliance officer', name: 'Compliance Officer' },
    { id: 'legal counsel', name: 'Legal Counsel' }
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setResponse(null);

    try {
      const searchData = {
        question: query,
        frameworks: selectedFramework === 'all' ? undefined : [selectedFramework],
        role: selectedRole
      };

      console.log('🔍 Searching with:', searchData);

      const res = await fetch('/api/v1/qa/high-confidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchData)
      });

      const data = await res.json();

      if (data.success) {
        setResponse(data.response);
        console.log('✅ Response received:', data.response);
      } else {
        throw new Error(data.error || 'Search failed');
      }
    } catch (error) {
      console.error('❌ Search error:', error);
      setResponse({
        success: false,
        answer: 'Sorry, I encountered an error while searching. Please try again.',
        confidence: 0,
        citations: []
      });
    } finally {
      setIsSearching(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center bg-black">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-black">SCK Policy Agent</span>
            </div>
            <div className="text-sm text-gray-600">
              High-Confidence Regulatory Intelligence
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Interface */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-6">
            Search Regulatory Frameworks
          </h1>
          
          {/* Filters */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Framework
              </label>
              <select
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {frameworks.map(framework => (
                  <option key={framework.id} value={framework.id}>
                    {framework.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ask about compliance requirements, security controls, or policy recommendations..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-lg"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <button
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Response Display */}
        {response && (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            {/* Confidence Score */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className={`h-5 w-5 ${response.confidence >= 0.9 ? 'text-green-600' : response.confidence >= 0.7 ? 'text-yellow-600' : 'text-red-600'}`} />
                <span className="text-sm font-medium text-gray-700">
                  Confidence: {(response.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(response.answer)}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-black transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Answer */}
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-800 leading-relaxed mb-4">
                {response.answer}
              </p>
            </div>

            {/* Citations */}
            {response.citations && response.citations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Sources:</h4>
                <ul className="space-y-1">
                  {response.citations.map((citation, index) => (
                    <li key={index} className="text-xs text-gray-600">
                      {citation}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sample Response */}
            {response.sampleResponse && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Implementation:</h4>
                <div className="bg-white rounded border p-3">
                  <p className="text-sm text-gray-800">{response.sampleResponse}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Example Queries */}
        {!response && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Example Queries:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setQuery("What are the key access control requirements for ISO 27001?");
                  setSelectedFramework("iso-27001");
                }}
                className="text-left p-3 border border-gray-200 rounded-lg hover:border-black transition-colors"
              >
                <p className="text-sm font-medium text-gray-900">ISO 27001 Access Control</p>
                <p className="text-xs text-gray-600">Key requirements for access management</p>
              </button>
              
              <button
                onClick={() => {
                  setQuery("How should a Product Manager implement OWASP security controls?");
                  setSelectedFramework("owasp");
                  setSelectedRole("product manager");
                }}
                className="text-left p-3 border border-gray-200 rounded-lg hover:border-black transition-colors"
              >
                <p className="text-sm font-medium text-gray-900">OWASP for Product Managers</p>
                <p className="text-xs text-gray-600">Implementation guidance for PMs</p>
              </button>
              
              <button
                onClick={() => {
                  setQuery("What are the GDPR requirements for data processing?");
                  setSelectedFramework("gdpr");
                }}
                className="text-left p-3 border border-gray-200 rounded-lg hover:border-black transition-colors"
              >
                <p className="text-sm font-medium text-gray-900">GDPR Data Processing</p>
                <p className="text-xs text-gray-600">Data protection requirements</p>
              </button>
              
              <button
                onClick={() => {
                  setQuery("How to implement NIS2 incident reporting?");
                  setSelectedFramework("nis2");
                }}
                className="text-left p-3 border border-gray-200 rounded-lg hover:border-black transition-colors"
              >
                <p className="text-sm font-medium text-gray-900">NIS2 Incident Reporting</p>
                <p className="text-xs text-gray-600">Incident response requirements</p>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
