'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark'


type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources: string[]
}

export default function ChatViewPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const chatId = searchParams.get('chatId')


  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({})
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chatId) return
    const fetchMessages = async () => {
      const res = await fetch(`/api/chats/${chatId}/messages`)
      const data = await res.json()
      setMessages(data.messages || [])
    }
    fetchMessages()
  }, [chatId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      sources: [],
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      let newChatId = chatId

      if (!newChatId) {
        const res = await fetch('/api/chats', { method: 'POST' })
        const data = await res.json()
        newChatId = data.chatId
        if (!newChatId) throw new Error('Failed to create chat');
        
        router.replace(`/chat/ask?chatId=${newChatId}`)
      }

      const res = await fetch(`/api/chats/${newChatId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content }),
      })

      const data = await res.json()

      if (data.assistantMessage) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: data.assistantMessage,
            sources: data.sources || [],
          },
        ])
      } else {
        toast.error('No response from assistant.')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to send message.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col  max-w-4xl mx-auto px-4 pt-6">
      <div className="flex-1 overflow-y-auto space-y-6 pb-32">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`relative max-w-[80%] px-4 py-3 rounded-xl shadow-md whitespace-pre-wrap text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white'
                }`}
            >
              {msg.role === 'assistant' ? (
                <ReactMarkdown
                  components={{
                    code({
                      inline,
                      className,
                      children,
                      ...props
                    }: {
                      inline?: boolean
                      className?: string
                      children?: React.ReactNode
                    }) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          language={match[1]}
                          style={oneDark}
                          PreTag="div"
                          customStyle={{ borderRadius: '0.5rem', padding: '1rem' }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-gray-700 px-1 py-0.5 rounded" {...props}>
                          {children}
                        </code>
                      )
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              ) : (
                msg.content
              )}

              {/* Toggle Sources */}
              {msg.role === 'assistant' && msg.sources?.length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={() =>
                      setExpandedSources((prev) => ({
                        ...prev,
                        [msg.id]: !prev[msg.id],
                      }))
                    }
                    className="text-xs text-blue-400 hover:underline focus:outline-none"
                  >
                    {expandedSources[msg.id] ? 'Hide Sources' : 'Show Sources'}
                  </button>

                  {expandedSources[msg.id] && (
                    <div className="mt-2 max-h-40 overflow-y-auto border border-gray-700 rounded-lg p-3 bg-gray-900 text-gray-200 text-xs space-y-2">
                      <p className="font-semibold">Sources:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {msg.sources.map((src, idx) => (
                          <li key={idx} className="break-words">{src}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            className="flex-1 border rounded px-4 py-2"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={loading}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
