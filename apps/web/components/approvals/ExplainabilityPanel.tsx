"use client";
import { useEffect, useState } from "react";

type Snapshot = {
  id: string;
  rationale: string;
  riskScore: number;
  riskVector: Record<string, number>;
  loaLevel: number;
  citations: { documentId: string; chunkIds: string[]; label?: string }[];
  policyMap: { policyId: string; title: string; version: number; tags?: string[] }[];
  aiInvolved: boolean;
  aiMeta?: any;
  createdAt: string;
};

export function ExplainabilityPanel({ approvalRequestId }: { approvalRequestId: string }) {
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/approvals/${approvalRequestId}/explainability`)
      .then(r => r.json())
      .then(data => setSnap(data.snapshot))
      .finally(() => setLoading(false));
  }, [approvalRequestId]);

  if (loading) return <div className="p-4">Loading explainability…</div>;
  if (!snap) return <div className="p-4">No explainability available yet.</div>;

  return (
    <div className="grid gap-4">
      {snap.aiInvolved && (
        <div className="rounded-xl border p-3 text-sm">
          <strong>AI Assistance:</strong> Generated with {snap.aiMeta?.provider ?? "unknown"} ({snap.aiMeta?.model ?? "n/a"}).
        </div>
      )}

      <div className="rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Rationale</h3>
          <span className="text-sm rounded-full border px-3 py-1">LoA L{snap.loaLevel}</span>
        </div>
        <p className="mt-2 whitespace-pre-wrap">{snap.rationale}</p>
      </div>

      <div className="rounded-xl border p-4">
        <h3 className="text-lg font-semibold">Risk</h3>
        <div className="mt-2">Overall: <strong>{snap.riskScore}/100</strong></div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {Object.entries(snap.riskVector).map(([k, v]) => (
            <div key={k} className="rounded-lg border p-2 text-sm">
              <div className="font-medium">{k}</div>
              <div className="h-2 w-full bg-gray-200 mt-1 rounded">
                <div className="h-2 rounded" style={{ width: `${v}%` }} />
              </div>
              <div className="text-right">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border p-4">
        <h3 className="text-lg font-semibold">Citations</h3>
        <ul className="mt-2 list-disc pl-5 text-sm">
          {snap.citations.map((c, i) => (
            <li key={i}>
              Doc <code>{c.documentId}</code> → Chunks: {c.chunkIds.slice(0, 5).join(", ")}
              {c.label ? <> — {c.label}</> : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border p-4">
        <h3 className="text-lg font-semibold">Policy Map</h3>
        <ul className="mt-2 list-disc pl-5 text-sm">
          {snap.policyMap.map(p => (
            <li key={p.policyId}>
              {p.title} (v{p.version}) {p.tags?.length ? `— [${p.tags.join(", ")}]` : ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

