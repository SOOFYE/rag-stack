alter table chats enable row level security;
alter table messages enable row level security;

create policy "Users can access their chats" on chats
  for all using (auth.uid() = user_id);

create policy "Users can access their chat messages" on messages
  for all using (
    chat_id in (select id from chats where user_id = auth.uid())
  );