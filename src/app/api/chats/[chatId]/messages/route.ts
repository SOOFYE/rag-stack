import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '../../../../../../utils/supabase/server'

export async function GET(req: Request, context: { params: { chatId: string } }) {
   const { params } =  context;
    const chatId = params.chatId;
  const supabase = await createSupabaseServerClient()
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ messages })
}