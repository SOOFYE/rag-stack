create table chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats(id) on delete cascade,
  role text check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default now()
);

create index on chats (user_id);
create index on messages (chat_id, created_at);
