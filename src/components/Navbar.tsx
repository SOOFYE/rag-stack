'use client'

import Link from 'next/link'
import LogoutButton from './LogoutButton'
import { useEffect} from 'react'
import { useAuth } from '../context/AuthContext'


export default function Navbar() {
  const { user } = useAuth()


  let isAuthPage = ['/', '/login', '/signup'].includes(
    // @ts-ignore
    typeof window === 'undefined' ? '' : window.location.pathname
  )

  useEffect(()=>{

isAuthPage = ['/', '/login', '/signup'].includes(
    // @ts-ignore
    typeof window === 'undefined' ? '' : window.location.pathname
  )

  },[user])

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-gray/10  border-b border-white/10 shadow-md">
      <div className="w-auto mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="ml-10 text-2xl font-bold font-[family-name:var(--font-geist-mono)]">
          RAGSTACK
        </Link>
        <nav className="space-x-4">
          {user ? (
            isAuthPage && !user ? (
              <Link href="/">
                <button className="bg-black text-white px-4 py-2 rounded">Home</button>
              </Link>
            ) : (
              <LogoutButton/>
            )
          ) : (
            <>
              <Link href="/signup">
                <button className="bg-black text-white px-4 py-2 rounded">Get Started</button>
              </Link>
              <Link href="/login">
                <button className="bg-white/20 text-black px-4 py-2 rounded">Login</button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
