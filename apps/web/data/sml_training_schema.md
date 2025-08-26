# SML Training Dataset Schema

## Input Fields
- `role_template`: Security role (security_engineer, devops, qa, sre, release_manager)
- `agent_trust_level`: 1-5 trust level (L1=1, L2=2, L3=3, L4=4, L5=5)
- `endpoint`: API endpoint being requested
- `environment`: dev, staging, prod
- `context_snippets`: Array of retrieved security framework passages
- `recent_signals`: Array of recent trust signals from external sources
- `urgency`: low, medium, high, critical

## Output Schema (JSON)
- `action`: Action name (rotate_key, request_deploy, run_security_scan, etc.)
- `endpoint`: Endpoint being accessed
- `arguments`: Action-specific parameters
- `requiresApproval`: Boolean indicating if approval is needed
- `approvalsNeeded`: Array of required approval roles
- `justification`: Human-readable rationale with citations
- `sources`: Array of source documents with scores
- `confidence`: Confidence score (0.0-1.0)
- `riskAssessment`: LOW, MEDIUM, HIGH, CRITICAL
- `complianceNotes`: Array of compliance references

## Training Guidelines
- Generate 10,000+ diverse examples
- Vary role templates, trust levels, environments
- Include edge cases (high-risk actions, low-trust agents)
- Ensure schema compliance for all outputs
