'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Chat = {
  id: string
  created_at: string
  // optionally add a name/title field in the future
}

export default function Sidebar() {
  const [chats, setChats] = useState<Chat[]>([])

  const router = useRouter()

const startNewChat = async () => {
  const res = await fetch('/api/chats', {
    method: 'POST',
  })

  const data = await res.json()

  if (data.chatId) {
    router.push(`/chat/ask?chatId=${data.chatId}`)
  } else {
    console.error('Failed to create chat')
  }
}

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch('/api/chats') // you must create this route
        const data = await res.json()
        setChats(data.chats || [])
      } catch (err) {
        console.error('Failed to fetch chats', err)
      }
    }

    fetchChats()
  }, [])

  return (
    <aside className="z-49 w-64 h-[calc(100vh-64px)] mt-[64px] bg-white/10 backdrop-blur-md border-r border-white/20 shadow-md flex flex-col justify-evenly px-4 py-6 fixed top-0 left-0">
      {/* Buttons */}
      <div className="flex flex-col items-start gap-5 text-lg">
        <Link href="/chat/ask">
          <button 
          className="cursor-pointer w-full font-bold text-black hover:bg-black hover:text-white border border-transparent px-4 py-2 rounded  backdrop-blur-md transition">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="inline size-4 mb-1 ">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>
 <p className="inline ml-2">Start New Chat</p>
          </button>
          </Link>


        <Link href="/chat/files/upload">
<button className="cursor-pointer w-full font-bold text-black hover:bg-black hover:text-white border border-transparent px-4 py-2 rounded  backdrop-blur-md transition">
            
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="inline size-4 mb-1 ">
  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
</svg>

            <p className="inline ml-2">Upload Files</p>
          </button>
        </Link>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-gray-700" />

      {/* Single File Chat History */}
      <div>
        <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
          Single File Chats
        </p>
        {chats.length === 0 ? (
  <p className="text-xs text-gray-500 italic">No chats yet.</p>
) : (
  <ul className="space-y-2 text-sm">
    {chats.map((chat) => (
      <li key={chat.id}>
        <Link
          href={`/chat/ask?chatId=${chat.id}`}
          className="hover:text-blue-400 block truncate"
        >
          Chat – {new Date(chat.created_at).toLocaleString()}
        </Link>
      </li>
    ))}
  </ul>
)}
      </div>
    </aside>
  )
}
