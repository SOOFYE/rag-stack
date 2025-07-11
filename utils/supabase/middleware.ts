// utils/supabase/middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function updateSession(request: NextRequest) {
  // 1. Prepare a mutable response
  let response = NextResponse.next({ request })

  // 2. Create a Supabase server client that uses the request's cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // write every cookie into our response
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // 3. MUST call getUser() to refresh the session and trigger setAll()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // 4. Define your protected / public-only routes
  const isProtectedRoute = pathname.startsWith('/chat')
  const isPublicOnlyRoute = ['/', '/login', '/signup'].includes(pathname)

  // 5a. If not logged in and trying to hit a protected page → redirect to /login
  if (isProtectedRoute && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  // 5b. If *logged in* and on home/login/signup → redirect to /chat
  if (isPublicOnlyRoute && user) {
    const chatUrl = request.nextUrl.clone()
    chatUrl.pathname = '/chat'
    return NextResponse.redirect(chatUrl)
  }

  // 6. Return our response (with any cookies written)
  return response
}
