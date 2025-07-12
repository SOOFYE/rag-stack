import { config } from 'dotenv';
config({ path: '.env.local' })

import { Worker } from 'bullmq'
import IORedis from 'ioredis'

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');  

import { REDIS_URL } from '../config/redis.ts'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { OpenAIEmbeddings } from "@langchain/openai";
import { SUPABASE_BUCKET_NAME, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from '../config/supabase.ts';
import { createClient } from '@supabase/supabase-js';


const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null, 
  enableReadyCheck: false,
})

export const supabaseAdmin = createClient(SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY! 
)


export const documentWorker = new Worker(
  'document-processing-queue',
  async (job) => {
    console.log(`Processing job ${job.id} for file:`, job.data)

try {
  
  const { data: fileData, error: downloadError } = await supabaseAdmin.storage
    .from(SUPABASE_BUCKET_NAME)
    .download(job.data.objectName)

    console.log('downloaded file')

  if (downloadError || !fileData) {
    throw new Error('File download failed: ' + downloadError)
  }

  // Convert ReadableStream/Blob to text
  const arrayBuffer = await fileData.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const parsed = await pdfParse(buffer)
  const text = parsed.text

   console.log('parsed text')

  
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })
  const docs = await splitter.createDocuments([text])

  //Embed each chunk
  const embedder = new OpenAIEmbeddings()
  const contents = docs.map((d) => d.pageContent)
  const embeddings = await embedder.embedDocuments(contents)

  //Insert into `document_chunks_vector`
const inserts = contents.map((chunk, i) => ({
  object_name: job.data.objectName,
  chunk_text: chunk.replace(/\u0000/g, ''), // remove null characters
  embedding: embeddings[i],
}))

  const { error: insertErr } = await supabaseAdmin
    .from('document_chunks_vector')
    .insert(inserts)

  if (insertErr) throw insertErr


  console.log('uploaded embeddings')

  
  await supabaseAdmin
    .from('user_documents')
    .update({ job_status: 'done' })
    .eq('id', job.data.documentId)

  console.log(`Job ${job.id} completed.`)
  return { status: 'done' }

} catch (err) {
  console.error(`Job ${job.id} failed:`, err)

  await supabaseAdmin
    .from('user_documents')
    .update({ job_status: 'failed' })
    .eq('id', job.data.documentId)

  throw err
}
  },
  {
    connection,
    concurrency: 4,
  }
)


