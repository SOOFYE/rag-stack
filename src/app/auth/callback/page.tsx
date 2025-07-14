'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const res = await fetch('/api/auth/callback' + window.location.search)
        const data = await res.json()

        if (res.ok && data.success) {
          router.push('/chat/ask')
        } else {
          router.push('/login?error=oauth')
        }
      } catch (err) {
        console.error(err)
        router.push('/login?error=callback-failed')
      }
    }

    handleOAuthCallback()
  }, [router])

  return <p>Finishing login...</p>
}