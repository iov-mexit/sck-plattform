-- Enable vector extension
create extension if not exists vector;

-- Create knowledge_chunks table
create table if not exists public.knowledge_chunks (
  id text primary key,
  embedding vector(384),
  metadata jsonb
);

-- Create index for vector similarity search
create index if not exists knowledge_chunks_embedding_idx 
  on knowledge_chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Drop existing function first (to fix return type conflict)
drop function if exists match_documents(vector, double precision, integer);

-- Create match_documents function for similarity search
create or replace function match_documents(
  query_embedding vector(384),
  match_threshold float default 0.78,
  match_count int default 5
)
returns table (
  id text,
  content text,
  similarity float
)
language sql stable
as $$
  select
    id,
    metadata->>'content' as content,
    1 - (knowledge_chunks.embedding <=> query_embedding) as similarity
  from knowledge_chunks
  where 1 - (knowledge_chunks.embedding <=> query_embedding) > match_threshold
  order by knowledge_chunks.embedding <=> query_embedding
  limit match_count;
$$;
