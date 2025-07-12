CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE document_chunks_vector (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_name text NOT NULL,              
  chunk_text text NOT NULL,              
  embedding vector(1536) NOT NULL       
);