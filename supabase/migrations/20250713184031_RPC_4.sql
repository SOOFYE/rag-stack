drop function if exists match_document_chunks_vector(vector, integer, jsonb);
drop function if exists match_document_chunks_vector(vector, integer);
create or replace function match_document_chunks_vector (
  query_embedding vector(1536),
  match_count int DEFAULT null,
  filter jsonb DEFAULT '{}'
) returns table (
  id uuid,
  content text,               
  metadata jsonb,
  embedding vector,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    dc.id,
    dc.chunk_text as content,  
    '{}'::jsonb as metadata,
    dc.embedding,
    1 - (dc.embedding <=> query_embedding) as similarity
  from document_chunks_vector dc
  where dc.embedding IS NOT NULL
  order by dc.embedding <=> query_embedding
  limit match_count;
end;
$$;
