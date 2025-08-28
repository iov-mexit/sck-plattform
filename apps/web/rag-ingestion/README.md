# RAG Ingestion Package (SCK Supabase + Local Embeddings)

This package ingests **public regulations** into your SCK Supabase database and prepares them
for use with the unified RAG system in SCK Platform.

## 📚 Included Regulations
- GDPR (EU General Data Protection Regulation)
- EU AI Act
- NIS2 Directive
- NIST Cybersecurity Framework
- OWASP Top 10

## ⚙️ Prerequisites
- Node.js 18+
- SCK Supabase project with `vector` extension enabled
- Environment variables (already configured in SCK):
  ```bash
  SUPABASE_URL=https://vqftrdxexmsdvhbbyjff.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
  ```

## 🚀 Setup
```bash
cd rag-ingestion
yarn install
```

## 🛠️ Run Ingestion
```bash
yarn seed
```

This will:
1. Fetch official texts (GDPR, EU AI Act, NIS2, NIST CSF, OWASP)
2. Chunk the text into 1k character blocks
3. Generate embeddings locally with @xenova/transformers (MiniLM-L6-v2)
4. Insert into your SCK Supabase `knowledge_chunks` table

## 🗄️ Database Schema
The package works with your existing SCK schema:
```sql
-- Already exists in your SCK project:
create table if not exists public.knowledge_chunks (
  id text primary key,
  embedding vector(384),
  metadata jsonb
);
```

## 📝 Notes
- Embeddings are generated locally (no OpenAI required)
- Dimensionality = 384, matches your existing schema
- Data is stored in `./data/` for debugging/backups
- Integrates seamlessly with your existing RAG API at `/api/rag/search`

## 🔗 Integration with SCK
- **Replaces** the current 30 sample chunks with real regulatory data
- **Enhances** your existing RAG system with professional embeddings
- **Maintains** your current API structure and frontend
- **Scales** for future regulatory framework additions

## 🎯 Next Steps
After ingestion, test your RAG system at `/rag/search` with queries like:
- "GDPR data protection requirements"
- "EU AI Act compliance controls"
- "NIST cybersecurity framework"
- "OWASP security vulnerabilities"
