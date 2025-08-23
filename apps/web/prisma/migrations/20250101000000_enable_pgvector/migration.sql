-- Enable pgvector (safe if already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- Note: If you want to switch knowledge_documents.embedding to Vector later, run:
-- ALTER TABLE "knowledge_documents" ALTER COLUMN "embedding" TYPE vector(768);
