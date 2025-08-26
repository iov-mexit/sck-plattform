# 🚀 SCK AI MCP Layer

**Small Model LLM (SML) Policy Engine with OPA Integration**

## 🎯 Overview

The AI MCP Layer provides intelligent policy decisions for Role Agents using a fine-tuned small language model (3-7B parameters) that integrates with Open Policy Agent (OPA) for enforcement. This creates a secure, auditable decision-making system grounded in security frameworks like ISO 27001, SOC2, and EU AI Act.

## 🏗️ Architecture

```
Role Agent Request → MCP Gateway → AI Decision Service → Policy LLM → OPA → Signed Decision
                                      ↓
                                Vector DB (RAG)
                                Security Frameworks
                                ISO/SOC/EU AI Act
```

## 🧩 Components

### 1. **Policy LLM Service** (`services/policy-llm/`)
- FastAPI service for AI decision making
- Integrates with Ollama for local model inference
- OPA integration for policy enforcement
- HMAC-signed decisions for security

### 2. **Training Pipeline** (`train/`)
- PEFT/LoRA fine-tuning for efficient training
- 10,000+ synthetic training examples
- Structured JSON output training
- Support for 3-7B parameter models

### 3. **OPA Policies** (`opa-config/`)
- Rego rules for MCP authorization
- Trust level enforcement
- Environment constraints
- Rate limiting and time windows

### 4. **Database Schema**
- `McpPolicy`: Policy definitions and constraints
- `AiDecision`: Audit trail of all decisions
- `KnowledgeDocument`: Security framework content
- `KnowledgeChunk`: Vector embeddings for RAG

## 🚀 Quick Start

### 1. **Generate Training Data**
```bash
cd scripts
node generate_sml_dataset.js
# Creates 10,000 training examples in data/train_generated.jsonl
```

### 2. **Start Policy LLM Service**
```bash
cd services/policy-llm
docker build -t sck-policy-llm .
docker run -p 8080:8080 sck-policy-llm
```

### 3. **Test AI Decision Endpoint**
```bash
curl -X POST http://localhost:3000/api/v1/ai/decide \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "agent_123",
    "roleTemplate": "security_engineer",
    "trustLevel": 3,
    "endpoint": "/secrets/rotate",
    "environment": "staging",
    "urgency": "high"
  }'
```

## 🔧 Configuration

### Environment Variables
```bash
# Policy LLM Service
POLICY_LLM_URL=http://localhost:8080
AI_DECISION_SIGNING_SECRET=your-secret-key

# Ollama Integration
OLLAMA_URL=http://localhost:11434
POLICY_LLM_MODEL=sck-policy-gguf

# OPA Integration
OPA_URL=http://localhost:8181/v1/data/mcp/auth/allow
```

### Database Migration
```bash
# Apply new schema
npx prisma db push

# Or use migrations
npx prisma migrate dev --name add_ai_mcp_layer
```

## 🎯 Training Your Own Model

### 1. **Install Dependencies**
```bash
pip install transformers peft accelerate bitsandbytes datasets
```

### 2. **Run Fine-tuning**
```bash
cd train
chmod +x run_finetune.sh
./run_finetune.sh
```

### 3. **Convert to Ollama Format**
```bash
# After training, convert to GGUF format for Ollama
# Use llama.cpp or similar tools
```

## 🔒 Security Features

### **Decision Signing**
- HMAC signatures for all decisions
- Timestamp-based replay protection
- Audit trail with cryptographic integrity

### **Policy Enforcement**
- OPA integration for rule-based decisions
- Trust level gating (L1-L5)
- Environment-specific constraints
- Rate limiting and time windows

### **Audit & Compliance**
- Full decision audit trail
- Prompt and response logging
- Source attribution for decisions
- Compliance framework mapping

## 📊 Monitoring & Metrics

### **Health Checks**
- Policy LLM service health: `/health`
- Available models: `/api/v1/ai/models`
- Decision history: `GET /api/v1/ai/decide`

### **Key Metrics**
- Decision latency (target: <500ms)
- Schema compliance rate (target: >99%)
- Policy enforcement accuracy
- Model confidence scores

## 🧪 Testing

### **Unit Tests**
```bash
# Test OPA policies
cd opa-config
opa test mcp-policies.rego mcp-policies_test.rego

# Test API endpoints
npm run test:ai
```

### **Integration Tests**
```bash
# End-to-end decision flow
npm run test:integration:ai
```

## 🔄 API Reference

### **POST /api/v1/ai/decide**
Request body:
```json
{
  "agentId": "string",
  "roleTemplate": "string",
  "trustLevel": 1-5,
  "endpoint": "string",
  "environment": "dev|staging|prod",
  "urgency": "low|medium|high|critical",
  "contextSnippets": [{"id": "string", "text": "string"}],
  "recentSignals": [{"source": "string", "score": "number"}]
}
```

Response:
```json
{
  "decision": "ALLOW|DENY|REQUIRES_APPROVAL",
  "action": {...},
  "policyEvaluation": {...},
  "signature": {...},
  "auditId": "string",
  "ttl": 300
}
```

## 🚀 Next Steps

### **Phase 1: Foundation** ✅
- [x] Database schema
- [x] Training pipeline
- [x] Policy LLM service
- [x] OPA integration
- [x] API endpoints

### **Phase 2: Enhancement**
- [ ] Vector DB integration (Pinecone/Milvus)
- [ ] RAG retrieval system
- [ ] Security framework ingestion
- [ ] Model performance optimization

### **Phase 3: Production**
- [ ] Federated learning pilot
- [ ] Advanced monitoring
- [ ] Performance tuning
- [ ] Security hardening

## 🤝 Contributing

1. Create feature branch: `git checkout -b feat/ai-enhancement`
2. Implement changes with tests
3. Update documentation
4. Submit pull request

## 📚 Resources

- [Open Policy Agent (OPA)](https://www.openpolicyagent.org/)
- [PEFT/LoRA Fine-tuning](https://huggingface.co/docs/peft)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SCK Platform Architecture](../README.md)

## 🆘 Support

For issues or questions:
1. Check the logs: `docker logs sck-policy-llm`
2. Verify OPA status: `curl http://localhost:8181/health`
3. Test Ollama: `curl http://localhost:11434/api/tags`
4. Review audit logs: `GET /api/v1/ai/decide`

---

**🎯 The AI MCP Layer transforms SCK from a static policy system to an intelligent, adaptive security platform that learns and improves over time.**
