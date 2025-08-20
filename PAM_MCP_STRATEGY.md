# Knaight PAM Strategy: Trust‑Gated MCP

## 1) Vision
Knaight provides a security control‑plane for AI and distributed compute: only ANS‑registered Role Agents with sufficient externally‑sourced trust may invoke privileged MCP/control endpoints. All decisions are auditable and revocable.

## 2) Objectives (MVP)
- Register Role Agents → auto‑register to ANS
- Ingest external trust signals → compute L1–L5
- Enforce trust‑gated MCP proxy → block/allow with reason
- Audit every decision (who, what, why, trust snapshot)

## 3) Scope (Phase 1)
- Minimal MCP Gateway API with HMAC upstream signing
- Trust summary API for UI and policy checks
- Baseline policies per role and environment (production/staging)

## 4) Architecture Overview
- App Router (Next.js) backend routes: `/api/v1/*`
- Database: Prisma models `role_agents`, `signals`, `role_trust_thresholds`, `audit_logs`
- New table: `mcp_policies` (role template × environment → min_trust_level, allowed_endpoints, constraints)
- External signal sources: SCW, ISACA, GitHub (no mock data)

## 5) APIs
- POST `/api/v1/mcp/gateway`
  - Body: `{ agentId, endpoint, method, payload?, headers? }`
  - Validations: caller auth (Magic), ANS registered, trust ≥ threshold, endpoint allowed, origin valid
  - Behavior: sign upstream request with HMAC header (`X-Knaight-Agent`, `X-Knaight-Signature`, `X-Knaight-Timestamp`), proxy response
- GET `/api/v1/agents/[id]/trust`
  - Returns: `{ agentId, ans: { id, status }, trust: { score, level, sources[] }, policy: { requiredLevel, requiredScore } }`

## 6) Data Model Additions
- `mcp_policies` (new)
  - `id` (string, pk)
  - `role_template_id` (fk)
  - `environment` (enum: development|staging|production)
  - `min_trust_level` (enum/string L1–L5)
  - `allowed_endpoints` (string[])
  - `constraints` (jsonb)
  - `createdAt`, `updatedAt`

## 7) Security by Design
- Authentication: Magic Link for admin UI; server‑side verification
- Authorization: RBAC (role template) + ABAC (trust level from external signals)
- Integrity to MCP: HMAC signature, timestamp/replay protection, allowed domain list
- Privacy: no PII beyond necessary; DID‑based agent identifiers
- Logging: structured audit entries with decision, trust snapshot, ANS metadata
- Revocation: short‑lived tokens; invalidate on ANS status/trust drop

## 8) Implementation Plan (Step‑by‑Step)
1. Schema
   - Add `mcp_policies` model, migrate, seed baseline policies (per role, per env)
2. Backend
   - Implement `/api/v1/agents/[id]/trust` (reads signals, thresholds, ANS fields)
   - Implement `/api/v1/mcp/gateway` (policy check, ANS check, trust check, proxy + HMAC)
3. Frontend
   - Dashboard: “MCP Gateway Demo” card (create agent → register ANS → call gateway → show allow/deny)
   - Services: “Trust‑Gated MCP Proxy” tile linking to demo
4. Config
   - `.env.local`: `MCP_GATEWAY_SIGNING_SECRET`, `ALLOWED_MCP_DOMAINS`
5. Docs
   - Runbook: how to rotate HMAC secret, update policies, read audits

## 9) Testing Strategy
- Unit
  - Trust level assignment from signals
  - Policy evaluation (role/env/endpoint, min level)
  - HMAC signing and timestamp window validation
- Integration
  - Deny when: not ANS‑registered, trust < threshold, endpoint not allowed
  - Allow when: ANS registered + trust ≥ threshold + endpoint allowed
  - Audit entries created with correct reasons
- Security
  - CORS/origin validation
  - Replay protection (reject stale timestamps)
  - Input validation with Zod

## 10) Acceptance Criteria (MVP)
- [ ] Two new APIs implemented and documented
- [ ] Policies persisted and enforced in gateway
- [ ] Demo flow shows deny→allow after trust signal
- [ ] All decisions audited with structured entries
- [ ] Tests: unit + integration green

## 11) Milestones
- M1: Schema + seeds + tests pass
- M2: Trust summary API + tests
- M3: MCP gateway + HMAC + tests
- M4: Dashboard demo + services tile
- M5: Docs (runbook, threat model checklist)

## 12) Risks & Mitigations
- Risk: Overbroad allowed endpoints → Mitigate with explicit allowlists per env
- Risk: Time skew affects replay checks → Mitigate with reasonable window and NTP guidance
- Risk: Signal latency → Cache current trust snapshot with expiry; show last updated in UI

## 13) Branching
- Feature branch: `feat/pam-mcp-gateway`
- PR checklist: security review (HMAC, CORS, replay), migration review, test coverage

---
This strategy aligns SCK/Knaight to a PAM‑grade, trust‑gated control‑plane for agents and MCPs, with external‑signal driven authorization and full auditability.
