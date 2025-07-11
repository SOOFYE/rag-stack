import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies() 

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options)
            }
          } catch (err) {
            // This is okay if you're in a Server Component that can't write cookies.
          }
        }
      }
    }
  )
}
