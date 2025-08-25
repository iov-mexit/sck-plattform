-- Enable pgvector extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- Create HNSW index for vector similarity search
-- Use cosine similarity for normalized vectors (recommended)
CREATE INDEX IF NOT EXISTS idx_chunk_embedding_hnsw_cosine
  ON "KnowledgeChunk" USING hnsw ( "embeddingV" vector_cosine_ops );

-- Alternative: L2 distance index
-- CREATE INDEX IF NOT EXISTS idx_chunk_embedding_hnsw_l2
--   ON "KnowledgeChunk" USING hnsw ( "embeddingV" vector_l2_ops );

-- Optional: IVF index for bulk collections (better for large datasets)
-- CREATE INDEX IF NOT EXISTS idx_chunk_embedding_ivf
--   ON "KnowledgeChunk" USING ivfflat ( "embeddingV" vector_cosine_ops ) 
--   WITH (lists = 100);

-- Performance optimization: Add partial index for active documents only
CREATE INDEX IF NOT EXISTS idx_chunk_embedding_active
  ON "KnowledgeChunk" ("embeddingV" vector_cosine_ops)
  WHERE "embeddingV" IS NOT NULL;

-- Metadata indexes for filtering
CREATE INDEX IF NOT EXISTS idx_chunk_model_version
  ON "KnowledgeChunk" ("embeddingModel", "embeddingVersion");

-- Composite index for efficient retrieval
CREATE INDEX IF NOT EXISTS idx_chunk_doc_ordinal_embedding
  ON "KnowledgeChunk" ("documentId", "ordinal", "embeddingV" vector_cosine_ops);

-- Additional indexes for the new approval system
CREATE INDEX IF NOT EXISTS idx_approval_vote_facet_reviewer
  ON "ApprovalVote" ("facet", "reviewerId");

CREATE INDEX IF NOT EXISTS idx_trust_ledger_chain
  ON "TrustLedgerEvent" ("prevHash", "contentHash");

CREATE INDEX IF NOT EXISTS idx_trust_ledger_batch_events
  ON "TrustLedgerEvent" ("batchId", "createdAt");

-- Performance indexes for explainability
CREATE INDEX IF NOT EXISTS idx_explainability_risk_score
  ON "Explainability" ("riskScore");

CREATE INDEX IF NOT EXISTS idx_explainability_created
  ON "Explainability" ("createdAt");
