'use client'

import { useAuth } from "../../context/AuthContext"

export default function ChatPage() {
  const { user } = useAuth()

  const getNameFromEmail = (email?: string) => {
    if (!email) return 'there'
    const namePart = email.split('@')[0].split('.')[0]
    return namePart.charAt(0).toUpperCase() + namePart.slice(1)
  }

  const displayName = getNameFromEmail(user?.email)

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] w-full px-8 py-10">
      <h1 className="text-5xl font-bold mb-6 text-center">Welcome, {displayName} 👋</h1>
      <p className="text-gray-600 text-lg text-center mb-4">You can:</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 max-w-6xl w-full">
        <div className="bg-white/20 border border-white/30 backdrop-blur-md rounded-lg p-6 shadow hover:shadow-lg transition text-center">
          <h3 className="text-lg font-semibold mb-2">Upload Files</h3>
          <p className="text-sm text-black">Upload your files to store and analyze them.</p>
        </div>

        <div className="bg-white/20 border border-white/30 backdrop-blur-md rounded-lg p-6 shadow hover:shadow-lg transition text-center">
          <h3 className="text-lg font-semibold mb-2">Chat</h3>
          <p className="text-sm text-black">Start a new chat with files you have uploaded.</p>
        </div>

        <div className="bg-white/20 border border-white/30 backdrop-blur-md rounded-lg p-6 shadow hover:shadow-lg transition text-center">
          <h3 className="text-lg font-semibold mb-2">Source backed</h3>
          <p className="text-sm text-black">Get your sources for your response.</p>
        </div>
      </div>
    </div>
  )
}
