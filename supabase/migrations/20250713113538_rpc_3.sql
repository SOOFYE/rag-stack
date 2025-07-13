create or replace function match_document_chunks_vector (
  query_embedding vector(1536),
  match_count int default null,
  filter jsonb default '{}'
)
returns table (
  id uuid,
  object_name text,
  chunk_text text,
  embedding jsonb,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    object_name,
    chunk_text,
    (embedding::text)::jsonb as embedding,
    1 - (document_chunks_vector.embedding <=> query_embedding) as similarity
  from document_chunks_vector
  where metadata @> filter
  order by document_chunks_vector.embedding <=> query_embedding
  limit match_count;
end;
$$;