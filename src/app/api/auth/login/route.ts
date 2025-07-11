
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../../../utils/supabase/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log(data)
  if (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true});
}