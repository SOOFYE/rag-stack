ALTER TABLE document_chunks_vector
ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb;

