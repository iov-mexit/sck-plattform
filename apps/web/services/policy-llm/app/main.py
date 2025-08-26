#!/usr/bin/env python3
"""
SCK Policy LLM Inference Service
FastAPI service for AI decision making with OPA integration
"""

import os
import json
import time
import hashlib
import hmac
import requests
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.security import HTTPBearer
from pydantic import BaseModel, Field
import jsonschema
from pydantic import ValidationError

# Configuration
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434")
OPA_URL = os.environ.get("OPA_URL", "http://localhost:8181/v1/data/mcp/auth/allow")
AI_DECISION_SIGNING_SECRET = os.environ.get("AI_DECISION_SIGNING_SECRET", "dev-secret")
MODEL_NAME = os.environ.get("POLICY_LLM_MODEL", "sck-policy-gguf")

app = FastAPI(title="SCK Policy LLM", version="1.0.0")
security = HTTPBearer()

# Pydantic models
class ContextSnippet(BaseModel):
    id: str
    text: str
    score: Optional[float] = None

class TrustSignal(BaseModel):
    source: str
    score: int

class DecideRequest(BaseModel):
    agentId: str = Field(..., description="Role Agent ID")
    roleTemplate: str = Field(..., description="Role template name")
    trustLevel: int = Field(..., ge=1, le=5, description="Trust level 1-5")
    endpoint: str = Field(..., description="Requested API endpoint")
    environment: str = Field(..., description="Environment: dev, staging, prod")
    urgency: str = Field(..., description="Urgency: low, medium, high, critical")
    contextSnippets: List[ContextSnippet] = Field(..., description="Retrieved security framework passages")
    recentSignals: List[TrustSignal] = Field(..., description="Recent trust signals")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")

class PolicyDecision(BaseModel):
    decision: str = Field(..., description="ALLOW, DENY, or REQUIRES_APPROVAL")
    action: Dict[str, Any] = Field(..., description="AI model output")
    policyEvaluation: Dict[str, Any] = Field(..., description="OPA policy result")
    signature: Dict[str, str] = Field(..., description="HMAC signature and timestamp")
    auditId: str = Field(..., description="Audit log ID")
    ttl: int = Field(..., description="Decision TTL in seconds")

# JSON Schema for model output validation
MODEL_OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "action": {"type": "string"},
        "endpoint": {"type": "string"},
        "arguments": {"type": "object"},
        "requiresApproval": {"type": "boolean"},
        "approvalsNeeded": {"type": "array", "items": {"type": "string"}},
        "justification": {"type": "string"},
        "sources": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "score": {"type": "number"},
                    "excerpt": {"type": "string"}
                },
                "required": ["id", "score"]
            }
        },
        "confidence": {"type": "number", "minimum": 0.0, "maximum": 1.0},
        "riskAssessment": {"type": "string", "enum": ["LOW", "MEDIUM", "HIGH", "CRITICAL"]},
        "complianceNotes": {"type": "array", "items": {"type": "string"}}
    },
    "required": ["action", "endpoint", "requiresApproval", "justification", "sources", "confidence"]
}

def sign_decision(payload: str, secret: str) -> Dict[str, str]:
    """Create HMAC signature for decision"""
    timestamp = str(int(time.time()))
    message = f"{payload}|{timestamp}"
    signature = hmac.new(
        secret.encode(), 
        message.encode(), 
        hashlib.sha256
    ).hexdigest()
    
    return {
        "signature": signature,
        "timestamp": timestamp
    }

def build_prompt(request: DecideRequest) -> str:
    """Build structured prompt for the Policy LLM"""
    
    # Format context snippets
    snippets_text = "\n".join([
        f"[{s.id}] {s.text[:400]}..." 
        for s in request.contextSnippets
    ])
    
    # Format recent signals
    signals_text = ", ".join([
        f"{s.source}:{s.score}" 
        for s in request.recentSignals
    ])
    
    prompt = f"""You are a Policy LLM for the SCK Platform.

ROLE PROFILE:
- Template: {request.roleTemplate}
- Trust Level: {request.trustLevel} (L{request.trustLevel})
- Environment: {request.environment}
- Endpoint: {request.endpoint}
- Urgency: {request.urgency}

TRUST CONTEXT:
- Recent Signals: {signals_text}
- Context Snippets:
{snippets_text}

DECISION REQUIREMENTS:
1. Respond with ONLY valid JSON according to the schema
2. Include explicit 'sources' citing retrieved document IDs
3. Set 'requiresApproval' = true for:
   - Production environment actions if trustLevel < 4
   - High-risk actions (delete, deploy, modify) regardless of trust level
   - Actions outside business hours
   - Actions exceeding rate limits

OUTPUT SCHEMA:
{{
  "action": "<action_name>",
  "endpoint": "<endpoint>",
  "arguments": {{}},
  "requiresApproval": true|false,
  "approvalsNeeded": ["role-id"],
  "justification": "rationale with citations [doc#id]",
  "sources": [{{"id":"doc-123","score":0.92,"excerpt":"..."}}],
  "confidence": 0.0-1.0,
  "riskAssessment": "LOW|MEDIUM|HIGH|CRITICAL",
  "complianceNotes": ["ISO_27001_A.12.6.1"]
}}

Response (JSON only):"""
    
    return prompt

async def call_ollama(prompt: str) -> str:
    """Call Ollama API for inference"""
    try:
        response = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.0,
                    "top_p": 0.9,
                    "max_tokens": 512
                }
            },
            timeout=30
        )
        response.raise_for_status()
        
        result = response.json()
        return result.get("response", "").strip()
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Ollama API call failed: {str(e)}"
        )

async def call_opa(request: DecideRequest, action: Dict[str, Any]) -> Dict[str, Any]:
    """Call OPA for policy evaluation"""
    try:
        opa_input = {
            "input": {
                "roleTemplate": request.roleTemplate,
                "trustScore": request.trustLevel,
                "endpoint": request.endpoint,
                "environment": request.environment,
                "action": action.get("action"),
                "urgency": request.urgency
            }
        }
        
        response = requests.post(
            OPA_URL,
            json=opa_input,
            timeout=5
        )
        response.raise_for_status()
        
        return response.json()
        
    except requests.exceptions.RequestException as e:
        # If OPA is unavailable, return default allow for development
        print(f"⚠️ OPA unavailable: {e}")
        return {"result": True, "reason": "OPA unavailable, default allow"}

async def store_audit_log(request: DecideRequest, decision: Dict[str, Any]) -> str:
    """Store decision in audit log (placeholder)"""
    # TODO: Implement actual audit log storage
    audit_id = f"audit_{int(time.time())}_{hash(request.agentId) % 10000}"
    print(f"📝 Audit log stored: {audit_id}")
    return audit_id

@app.post("/api/v1/ai/decide", response_model=PolicyDecision)
async def decide(request: DecideRequest):
    """Main decision endpoint"""
    
    print(f"🤖 Processing decision request for agent {request.agentId}")
    
    # 1. Build prompt
    prompt = build_prompt(request)
    
    # 2. Call Policy LLM
    print(" Calling Policy LLM...")
    llm_response = await call_ollama(prompt)
    
    # 3. Parse and validate JSON
    try:
        action = json.loads(llm_response)
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid JSON from Policy LLM: {str(e)}"
        )
    
    # 4. Validate schema
    try:
        jsonschema.validate(instance=action, schema=MODEL_OUTPUT_SCHEMA)
    except jsonschema.ValidationError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Model output schema validation failed: {str(e)}"
        )
    
    # 5. Call OPA for policy evaluation
    print("🔒 Evaluating policy with OPA...")
    opa_result = await call_opa(request, action)
    
    # 6. Determine final decision
    if not opa_result.get("result", False):
        decision = "DENY"
    elif action.get("requiresApproval", False):
        decision = "REQUIRES_APPROVAL"
    else:
        decision = "ALLOW"
    
    # 7. Store audit log
    audit_id = await store_audit_log(request, action)
    
    # 8. Sign decision
    decision_record = {
        "decision": decision,
        "action": action,
        "policyEvaluation": opa_result,
        "auditId": audit_id
    }
    
    payload = json.dumps(decision_record, sort_keys=True)
    signature = sign_decision(payload, AI_DECISION_SIGNING_SECRET)
    
    # 9. Return signed decision
    return PolicyDecision(
        decision=decision,
        action=action,
        policyEvaluation=opa_result,
        signature=signature,
        auditId=audit_id,
        ttl=300  # 5 minutes
    )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "SCK Policy LLM",
        "model": MODEL_NAME,
        "ollama_url": OLLAMA_URL,
        "opa_url": OPA_URL
    }

@app.get("/api/v1/ai/models")
async def list_models():
    """List available models"""
    try:
        response = requests.get(f"{OLLAMA_URL}/api/tags", timeout=5)
        if response.status_code == 200:
            models = response.json().get("models", [])
            return {"models": [m["name"] for m in models]}
        else:
            return {"models": [], "error": "Failed to fetch models"}
    except:
        return {"models": [], "error": "Ollama unavailable"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
