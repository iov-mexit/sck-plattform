# SCK Platform - Milestone 1: AI & RAG Implementation

## 🎯 Overview

This milestone adds AI-powered policy intelligence and RAG (Retrieval-Augmented Generation) capabilities to the SCK Platform. The implementation is designed to be **safe, deployable, and extensible** with local LLM support via Ollama.

## 📦 What's Included

### 1. **Prisma Models** - New AI & RAG Tables
- `knowledge_documents` - Document storage with chunking and embeddings
- `ai_recommendations` - AI-generated policy recommendations
- `trust_ledger` - Immutable audit trail of AI decisions
- `policy_bundles` - Versioned policy storage
- `artifact_risk_profiles` - Risk assessment tracking

### 2. **pgvector Enablement**
- Migration to enable PostgreSQL vector extension
- Support for high-dimensional embeddings (768D default)
- Optional: Switch from `Bytes` to `@db.Vector(768)` for native vector operations

### 3. **LLM Client** - Ollama + Safe Stub
- **Ollama Integration**: Local LLM support with `llama3.1:8b-instruct`
- **Stub Fallback**: Deterministic, safe output when LLM unavailable
- **Server-Side Only**: No client-side LLM calls
- **Graceful Degradation**: Falls back to stub if Ollama fails

### 4. **Embeddings & RAG**
- **Pluggable Embeddings**: Stub (deterministic) + future local models
- **Simple Retrieval**: Text-based search (upgrade to vector similarity later)
- **Document Chunking**: Automatic 1200-character chunking
- **Hash-Based Deduplication**: SHA256 content hashing

### 5. **API Routes**
- `POST /api/knowledge/ingest` - Store and process documents
- `POST /api/ai/policy-draft` - Generate AI policy recommendations

### 6. **Admin Interface**
- AI Status page at `/admin/ai-status`
- Test policy draft functionality
- Monitor LLM provider status

## 🚀 Quick Start

### 1. **Environment Setup**
```bash
# Copy and configure environment
cp env.example .env.local

# AI Configuration (defaults to safe stub mode)
LLM_PROVIDER=stub                    # stub | ollama
OLLAMA_HOST=http://127.0.0.1:11434  # Ollama server URL
EMBEDDING_PROVIDER=stub              # stub | (future: text-embeddings-inhouse)
EMBEDDING_DIM=768                    # Vector dimensions
AI_POLICY_DRAFT_ENABLED=true         # Enable AI policy drafting
RAG_ENABLED=true                     # Enable RAG functionality
```

### 2. **Database Migration**
```bash
# Apply new schema
npm run db:push

# Or if using migrations
npx prisma migrate dev --name milestone1_ai_rag
```

### 3. **Test the Setup**
```bash
# Start development server
npm run dev

# Visit AI Status page
open http://localhost:3000/admin/ai-status

# Test policy draft
curl -X POST http://localhost:3000/api/ai/policy-draft \
  -H 'content-type: application/json' \
  -d '{"artifact":{"type":"MCP","id":"demo-mcp-1"},"goal":"baseline policy","riskHint":"medium"}'
```

### 4. **Ingest Sample Knowledge**
```bash
# Run sample ingest script
npm run rag:ingest:sample
```

## 🔧 Configuration Options

### LLM Provider Selection
```bash
# Safe stub mode (default)
LLM_PROVIDER=stub

# Local Ollama mode
LLM_PROVIDER=ollama
OLLAMA_HOST=http://127.0.0.1:11434
```

### Embedding Configuration
```bash
# Deterministic stub (safe for production)
EMBEDDING_PROVIDER=stub
EMBEDDING_DIM=768

# Future: Local embedding model
# EMBEDDING_PROVIDER=text-embeddings-inhouse
# EMBEDDING_MODEL_PATH=/path/to/model
```

### Feature Flags
```bash
AI_POLICY_DRAFT_ENABLED=true    # Enable AI policy drafting
RAG_ENABLED=true                # Enable RAG functionality
```

## 🏗️ Architecture

### Data Flow
```
Document Input → Chunking → Embedding → Storage → Retrieval → LLM → Policy Draft
     ↓              ↓          ↓         ↓         ↓        ↓        ↓
  /ingest      Text Split   Stub/LLM   Prisma   Search   Ollama   JSON
```

### Component Structure
```
lib/
├── ai/
│   └── llm.ts              # LLM client (Ollama + stub)
├── rag/
│   ├── embeddings.ts       # Embedding generation
│   └── retrieval.ts        # Knowledge retrieval
└── database.ts             # Prisma client

app/api/
├── knowledge/
│   └── ingest/route.ts     # Document ingestion
└── ai/
    └── policy-draft/route.ts # AI policy generation

app/(authenticated)/admin/
└── ai-status/page.tsx      # Admin monitoring
```

## 🔒 Security & Safety

### Stub Mode Benefits
- **Deterministic Output**: Same input always produces same output
- **No Network Calls**: Completely offline and safe
- **CI/CD Safe**: Won't break builds or deployments
- **Production Ready**: Can deploy immediately

### LLM Safety Features
- **Server-Side Only**: No client-side LLM exposure
- **Input Validation**: Structured input validation
- **Output Parsing**: Safe JSON parsing with fallbacks
- **Audit Trail**: All AI decisions logged to trust ledger

### Data Privacy
- **Organization Isolation**: Knowledge documents can be org-specific or global
- **Hash-Based Deduplication**: Prevents duplicate content storage
- **Audit Logging**: Complete trail of AI recommendations

## 📊 Database Schema

### Core Tables
```sql
-- Knowledge storage with embeddings
knowledge_documents (
  id, organizationId, sourceType, title, content,
  embedding, hash, chunkIndex, framework, jurisdiction
)

-- AI recommendations
ai_recommendations (
  id, organizationId, agentType, inputRef,
  outputJson, confidence, rationale, citations
)

-- Trust audit trail
trust_ledger (
  id, eventType, payloadHash, payload, merkleRoot, anchoredTx
)
```

### Indexes
```sql
-- Performance optimization
CREATE INDEX idx_knowledge_hash ON knowledge_documents(hash);
CREATE INDEX idx_knowledge_org ON knowledge_documents(organizationId);
CREATE INDEX idx_knowledge_framework ON knowledge_documents(framework);
```

## 🧪 Testing & Validation

### Manual Testing
1. **AI Status Page**: `/admin/ai-status`
2. **Policy Draft API**: Test with various artifacts and risk levels
3. **Knowledge Ingest**: Add sample documents and verify storage

### API Testing
```bash
# Test knowledge ingest
curl -X POST http://localhost:3000/api/knowledge/ingest \
  -H 'content-type: application/json' \
  -d '{
    "title": "Test Document",
    "content": "This is a test document for validation...",
    "framework": "ISO27001",
    "jurisdiction": "EU"
  }'

# Test policy draft
curl -X POST http://localhost:3000/api/ai/policy-draft \
  -H 'content-type: application/json' \
  -d '{
    "artifact": {"type": "MCP", "id": "test-mcp"},
    "goal": "Create access policy",
    "riskHint": "high"
  }'
```

### Validation Checklist
- [ ] Database migration successful
- [ ] AI Status page loads without errors
- [ ] Policy draft API returns valid responses
- [ ] Knowledge ingest creates documents
- [ ] Stub mode works without LLM
- [ ] Ollama integration works (if configured)

## 🚀 Next Steps

### Phase 2: Enhanced RAG
- [ ] Vector similarity search with pgvector
- [ ] Local embedding models (sentence-transformers)
- [ ] Semantic document clustering
- [ ] Advanced retrieval strategies

### Phase 3: LLM Enhancement
- [ ] Multiple model support
- [ ] Prompt engineering optimization
- [ ] Response validation and filtering
- [ ] Multi-agent coordination

### Phase 4: Production Features
- [ ] Rate limiting and API keys
- [ ] Model performance monitoring
- [ ] A/B testing for recommendations
- [ ] Compliance and audit features

## 🐛 Troubleshooting

### Common Issues

#### Stub Mode Always Active
```bash
# Check environment variables
npm run ai:status

# Verify .env.local configuration
cat .env.local | grep LLM_PROVIDER
```

#### Ollama Connection Failed
```bash
# Check Ollama service
ollama serve

# Verify model availability
ollama list

# Test connection
curl http://127.0.0.1:11434/api/tags
```

#### Database Migration Errors
```bash
# Reset and regenerate
npx prisma migrate reset
npx prisma generate
npm run db:push
```

### Debug Mode
```bash
# Enable debug logging
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_LOG_LEVEL=debug

# Check console for detailed logs
```

## 📚 API Reference

### Knowledge Ingest
```typescript
POST /api/knowledge/ingest
{
  title: string,           // Document title
  content: string,         // Full document content
  organizationId?: string, // Optional org association
  sourceType?: string,     // "manual" | "url" | "upload"
  framework?: string,      // "ISO27001" | "SOC2" | "EU AI Act"
  jurisdiction?: string,   // "EU" | "US" | ...
  chunkSize?: number       // Default: 1200
}
```

### Policy Draft
```typescript
POST /api/ai/policy-draft
{
  artifact: {              // Target artifact
    type: string,          // "MCP" | "RoleAgent" | "ANS"
    id: string
  },
  organizationId?: string, // Optional org context
  goal: string,            // Policy creation goal
  riskHint: string         // "low" | "medium" | "high"
}
```

## 🤝 Contributing

### Development Guidelines
1. **Always test with stub mode first**
2. **Validate database migrations**
3. **Test API endpoints manually**
4. **Verify admin interface functionality**
5. **Check security implications**

### Code Standards
- TypeScript strict mode
- Server-side LLM calls only
- Proper error handling and logging
- Comprehensive input validation
- Audit trail for all AI decisions

---

**🎉 Milestone 1 Complete!** Your SCK Platform now has AI-powered policy intelligence with safe, deployable RAG capabilities.
