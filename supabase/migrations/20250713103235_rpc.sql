create or replace function match_document_chunks_vector(
  query_embedding vector(1536),
  match_count int
)
returns table (
  id uuid,
  object_name text,
  chunk_text text,
  similarity float
)
language sql stable
as $$
  select
    id,
    object_name,
    chunk_text,
    1 - (embedding <=> query_embedding) as similarity
  from document_chunks_vector
  order by embedding <=> query_embedding
  limit match_count;
$$;