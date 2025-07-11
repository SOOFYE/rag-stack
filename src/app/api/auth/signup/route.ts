import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '../../../../../utils/supabase/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: undefined,
    },
  });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}