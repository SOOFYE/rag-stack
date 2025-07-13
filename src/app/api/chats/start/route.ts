import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '../../../../../utils/supabase/server'

export async function POST(req: Request) {
  const body = await req.json()
  const supabase = await createSupabaseServerClient()

  const { data: user } = await supabase.auth.getUser()

  if (!user?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: chat, error } = await supabase
    .from('chats')
    .insert([{ user_id: user.user.id }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('messages').insert([
    {
      chat_id: chat.id,
      role: 'user',
      content: body.message,
    },
  ])

  return NextResponse.json({ chatId: chat.id })
}