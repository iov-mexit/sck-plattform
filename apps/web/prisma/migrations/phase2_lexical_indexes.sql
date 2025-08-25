-- Phase 2: Text Search Indexes for KnowledgeChunk
-- Enable trigram or full-text depending on Postgres flavor. For vanilla PG:

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Text indexes on chunks for fast lexical search
CREATE INDEX IF NOT EXISTS idx_chunks_content_gin
  ON "KnowledgeChunk"
  USING gin (content gin_trgm_ops);

-- Optional: full-text index (if you prefer to tokenize)
-- ALTER TABLE "KnowledgeChunk" ADD COLUMN IF NOT EXISTS tsv tsvector
--   GENERATED ALWAYS AS (to_tsvector('simple', content)) STORED;
-- CREATE INDEX IF NOT EXISTS idx_chunks_tsv ON "KnowledgeChunk" USING gin (tsv);

-- Additional performance indexes for Phase 2
CREATE INDEX IF NOT EXISTS idx_chunks_document_ordinal
  ON "KnowledgeChunk" ("documentId", ordinal);

CREATE INDEX IF NOT EXISTS idx_documents_source_type
  ON "KnowledgeDocument" ("sourceType");

CREATE INDEX IF NOT EXISTS idx_documents_tags
  ON "KnowledgeDocument" USING gin (tags);

-- Index for explainability snapshots
CREATE INDEX IF NOT EXISTS idx_explainability_approval
  ON "ExplainabilitySnapshot" ("approvalRequestId");

CREATE INDEX IF NOT EXISTS idx_explainability_created
  ON "ExplainabilitySnapshot" ("createdAt");
