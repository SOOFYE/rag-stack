import { NextResponse } from 'next/server'
import { z } from 'zod'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { createSupabaseServerClient } from '../../../../../../utils/supabase/server'

const bodySchema = z.object({
  message: z.string().min(1),
})

export async function POST(req: Request, context: { params: { chatId: string } }) {
  const { params } =  context;
  const chatId = params.chatId;
  const json = await req.json()
  const body = bodySchema.safeParse(json)

  if (!body.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { message } = body.data

  const supabase = await createSupabaseServerClient()

  // Save user message
  await supabase.from('messages').insert({
    chat_id: chatId,
    content: message,
    role: 'user',
  })

  const vectorStore = await SupabaseVectorStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    {
      client: supabase,
      tableName: 'document_chunks_vector',
      queryName: 'match_document_chunks_vector',
    }
  )

  const relevantDocs = await vectorStore.similaritySearch(message, 4)

  console.log("🔍 relevantDocs", relevantDocs)

  if (relevantDocs.length === 0) {
    const apologyMessage = `Sorry, I couldn't find any relevant sources to answer your question.`

    await supabase.from('messages').insert({
      chat_id: chatId,
      content: apologyMessage,
      role: 'assistant',
    })

    return NextResponse.json({ assistantMessage: apologyMessage, sources: [] })
  }

  const contextText  = relevantDocs.map(doc => doc.pageContent).join('\n\n')

  const prompt = PromptTemplate.fromTemplate(
    `You are an AI assistant. Use only the following context to answer the question.

Context:
{context}

Question: {question}`
  )

  const chain = RunnableSequence.from([
    prompt,
    new ChatOpenAI({ temperature: 0 }),
  ])

  const response = await chain.invoke({
    context: contextText,
    question: message,
  })

  const assistantMessage = response.content

  console.log(contextText)


await supabase.from('messages').insert({
  chat_id: chatId,
  content: assistantMessage,
  role: 'assistant',
  sources: relevantDocs
  .map(doc => doc.pageContent?.trim())
  .filter(Boolean)

})

  return NextResponse.json({
    assistantMessage,
    sources: relevantDocs
  .map(doc => doc.pageContent?.trim())
  .filter(Boolean)


  })
}