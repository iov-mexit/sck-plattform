"use client";

import { useState, useEffect } from "react";

interface PolicyDraft {
  id: string;
  query: string;
  draft: string;
  status: string;
  createdAt: string;
}

export default function ApprovalDashboardPage() {
  const [policies, setPolicies] = useState<PolicyDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    fetchPolicies();
  }, [filter]);

  async function fetchPolicies() {
    try {
      const res = await fetch(`/api/v1/policy/submit-approval?status=${filter}`);
      const data = await res.json();
      if (data.success) {
        setPolicies(data.policies);
      }
    } catch (error) {
      console.error("Error fetching policies:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(policyId: string, newStatus: string) {
    try {
      const res = await fetch("/api/v1/policy/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policyId, status: newStatus }),
      });

      if (res.ok) {
        // Update local state
        setPolicies(prev =>
          prev.map(policy =>
            policy.id === policyId
              ? { ...policy, status: newStatus }
              : policy
          )
        );

        alert(`✅ Policy ${newStatus}`);
      } else {
        alert("❌ Error updating policy status");
      }
    } catch (error) {
      alert("❌ Error updating policy status");
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString() + " " +
      new Date(dateString).toLocaleTimeString();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading policies...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h1 className="text-2xl font-bold mb-6">📋 Policy Approval Dashboard</h1>

          {/* Filter Tabs */}
          <div className="flex space-x-2 mb-6">
            {["pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg ${filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({policies.filter(p => p.status === status).length})
              </button>
            ))}
          </div>

          {/* Policies List */}
          {policies.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No {filter} policies found.
            </div>
          ) : (
            <div className="space-y-4">
              {policies.map((policy) => (
                <div key={policy.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">🔍 Query:</h3>
                      <p className="text-gray-700 mb-3">{policy.query}</p>

                      <h4 className="font-semibold mb-2">📝 Draft Policy:</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{policy.draft}</p>
                    </div>

                    <div className="ml-4 text-right">
                      <div className="text-sm text-gray-500 mb-2">
                        {formatDate(policy.createdAt)}
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${policy.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          policy.status === "approved" ? "bg-green-100 text-green-800" :
                            "bg-red-100 text-red-800"
                        }`}>
                        {policy.status.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {policy.status === "pending" && (
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleStatusUpdate(policy.id, "approved")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(policy.id, "rejected")}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
