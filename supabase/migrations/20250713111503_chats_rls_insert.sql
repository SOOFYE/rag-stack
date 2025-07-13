create policy "Users can insert their chats" on chats
  for insert with check (user_id = auth.uid());