
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../../../utils/supabase/server';


export async function GET(req: Request) {
  const requestUrl = new URL(req.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'Missing OAuth code' }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.exchangeCodeForSession(req.url)

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
