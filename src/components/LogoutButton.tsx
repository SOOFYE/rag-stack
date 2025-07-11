'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabaseBrowserClient } from '../../utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { useAuth } from '../context/AuthContext'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()

 const handleLogout = async () => {
    setLoading(true)
    await supabaseBrowserClient.auth.signOut()
    setLoading(false)
    setUser(null)
    router.push('/')
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      {loading ? 'Logging out…' : 'Logout'}
    </button>
  )
}