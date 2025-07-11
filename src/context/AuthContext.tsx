'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabaseBrowserClient } from '../../utils/supabase/client'


type AuthContextType = {
  user: User | null
  setUser: (u: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // On mount, read initial session from Supabase
  useEffect(() => {
    supabaseBrowserClient.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
    // listen for SIGNED_IN / SIGNED_OUT
    const { data: { subscription } } =
      supabaseBrowserClient.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used under AuthProvider')
  return ctx
}