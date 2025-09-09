# SCK Platform Roadmap

## 🎯 Current Status: Production-Ready QA System

### ✅ Completed (Q1 2025)
- **Enhanced QA System**: Framework+role-aware reranking with 0.95 confidence
- **Strict Framework Filtering**: No cross-framework contamination
- **Role-Intent Boosting**: Semantic keyword fallback and tie-breakers
- **Context Deduplication**: Framework-only citations and clean responses
- **Singleton Knowledge Manager**: Consistent initialization across requests
- **Dense Knowledge Chunks**: 60+ role-first JSONL entries across 8 frameworks

### 🔧 Tech Debt (Q2 2025)

#### **Role-Pure Response Generation**
- [ ] Add LLM post-processing step to produce role-pure answers from retrieved chunks
- [ ] Design prompt contract (system/instructions/output schema) for role-specific summarization
- [ ] Implement few-shot scaffolding (pluggable examples per framework+role)
- [ ] Add fallback logic: verbatim top chunk when LLM low-confidence or provider unavailable

#### **Monitoring & Quality**
- [ ] Wire telemetry: log retrieval scores, boosts, LLM token usage, and confidence
- [ ] Extend retrieval harness to validate role-pure outputs (no cross-role bleed)
- [ ] CI preview build gating on harness pass rate and type/lint checks

#### **Content & Configuration**
- [ ] Content hygiene: split multi-role JSONL into role-specific variants where feasible
- [ ] Add config flags to toggle LLM post-processing and few-shot profiles per env
- [ ] Security controls: redact secrets, enforce framework-only citations in LLM outputs

### 🚀 Roadmap (Q3-Q4 2025)

#### **LLM Infrastructure**
- [ ] Deploy Strato VPS VC 6-24 for local LLM inference (Mistral 7B + Llama 3.1 8B)
- [ ] Integrate Ollama API for role-pure answer generation
- [ ] Implement LLM post-processing pipeline with fallback to verbatim chunks

#### **Advanced Features**
- [ ] Add few-shot templates and prompt engineering for role-specific outputs
- [ ] Optimization phase: curate few-shot examples per framework+role and AB-test prompts
- [ ] Monitor Supabase usage and upgrade to Pro if vector search needed

#### **Performance & Scale**
- [ ] Implement caching layer for frequently accessed knowledge chunks
- [ ] Add real-time knowledge chunk updates via webhooks
- [ ] Optimize embedding generation for larger knowledge bases

#### **Cost Optimization Options**
- [ ] **BitNet.cpp Evaluation**: Microsoft's 1-bit LLM for ultra-low resource usage
  - **Benefits**: 1-2GB RAM, 0.5-1GB storage, €4/month VPS (vs €16/month)
  - **Status**: Experimental, monitor for production readiness
  - **Migration Path**: Replace Mistral 7B if BitNet proves stable
  - **Potential Savings**: €12/month (57% cost reduction)

## 📊 Success Metrics

### **Current Performance**
- **Confidence**: 0.95 across all tested scenarios
- **Framework Accuracy**: 100% correct citations
- **Response Time**: <200ms for most queries
- **Test Coverage**: 3/5 harness tests passing

### **Target Performance (Post-LLM)**
- **Role Purity**: 100% role-specific responses
- **Confidence**: Maintain 0.95+ with LLM post-processing
- **Response Time**: <500ms including LLM inference
- **Test Coverage**: 5/5 harness tests passing

## 💰 Cost Analysis

### **Current Costs**
- **Supabase**: €0 (Free Plan)
- **Domains**: €5/month (Strato)
- **Total**: €5/month

### **Future Costs (LLM Integration)**

#### **Option A: Standard LLM (Mistral 7B)**
- **Supabase**: €0-25/month (Free to Pro)
- **Strato VPS**: €16/month (VC 6-24)
- **Domains**: €5/month
- **Total**: €21-46/month

#### **Option B: BitNet.cpp (1-bit LLM)**
- **Supabase**: €0-25/month (Free to Pro)
- **Strato VPS**: €4/month (VC 2-4)
- **Domains**: €5/month
- **Total**: €9-34/month
- **Savings**: €12/month (57% reduction)

## 🎯 Priority Matrix

### **High Priority (Q2)**
1. Role-pure response generation
2. Enhanced monitoring and telemetry
3. Content hygiene improvements

### **Medium Priority (Q3)**
1. LLM infrastructure deployment
2. Few-shot template implementation
3. Performance optimizations

### **Low Priority (Q4)**
1. Advanced prompt engineering
2. Supabase Pro upgrade (if needed)
3. Real-time knowledge updates
4. **BitNet.cpp evaluation and migration** (if stable)

## 🔄 Review Cycle
- **Monthly**: Progress review and priority adjustment
- **Quarterly**: Roadmap update and new feature planning
- **Annually**: Strategic direction and cost optimization
