
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../../../utils/supabase/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${url.origin}/login`);
  }

  const supabase = await createSupabaseServerClient()


  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${url.origin}/login?error=oauth`);
  }

  return NextResponse.redirect(`${url.origin}/chat`);
}