create table user_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  name text not null,
  type text,
  size bigint,
  created_at timestamp with time zone default now()
);

create policy "Allow users to view their documents"
on user_documents
for select
to authenticated
using (user_id = auth.uid());

create policy "Allow users to insert their documents"
on user_documents
for insert
to authenticated
with check (user_id = auth.uid());