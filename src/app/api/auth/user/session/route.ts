import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '../../../../../../utils/supabase/server'


export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error || !session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  return NextResponse.json({
    user: session.user,
    access_token: session.access_token,
  })
}
