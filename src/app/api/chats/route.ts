import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '../../../../utils/supabase/server'


export async function GET() {
  const supabase = await createSupabaseServerClient()

  const {
  data: { user },
} = await supabase.auth.getUser()

console.log('User:', user)

  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ chats: data })
}

export async function POST() {
  const supabase = await createSupabaseServerClient()

    const {
  data: { user },
} = await supabase.auth.getUser()

if(!user) return NextResponse.json({ error: "No Auth user" }, { status: 400 })

  const { data, error } = await supabase
  .from('chats')
  .insert({ user_id: user.id })
  .select()
  .single()

  if (error || !data) {
    console.log(error)
    return NextResponse.json({ error: error?.message || 'Failed to create chat' }, { status: 500 })
  }

  return NextResponse.json({ chatId: data.id })
}