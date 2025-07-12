
ALTER TABLE user_documents
ADD COLUMN job_id TEXT;


DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_status_enum') THEN
    CREATE TYPE job_status_enum AS ENUM ('pending', 'processing', 'completed', 'failed');
  END IF;
END
$$;


ALTER TABLE user_documents
ADD COLUMN job_status job_status_enum DEFAULT 'pending';