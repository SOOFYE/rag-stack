import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '../../../../../utils/supabase/server'
import { randomUUID } from 'crypto'
import { documentQueue } from '../../../../lib/documentQueue'


export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, object_name, type, size } = body

  
  const docId = randomUUID()

  
  const { error: insertError } = await supabase.from('user_documents').insert({
    id: docId,
    user_id: user.id,
    name,
    object_name,
    type,
    size,
    job_status: 'pending' 
  })

  if (insertError) {
    console.error('Insert error:', insertError)
    return NextResponse.json({ error: 'Failed to save document.' }, { status: 500 })
  }

  
  try {
    const job = await documentQueue.add('process-document', {
      documentId: docId,
      userId: user.id,
      objectName: object_name,
      originalName: name,
    })

    
    const { error: updateError } = await supabase
      .from('user_documents')
      .update({ job_id: job.id })
      .eq('id', docId)

    if (updateError) {
      console.error('Job ID update failed:', updateError)
      return NextResponse.json({ error: 'Job enqueued but DB update failed' }, { status: 500 })
    }

    
    return NextResponse.json({
      success: true,
      document: {
        id: docId,
        name,
        object_name,
        type,
        size,
        job_id: job.id,
        job_status: 'queued'
      }
    })
  } catch (err) {
    console.error('Queue error:', err)

    
    await supabase
      .from('user_documents')
      .update({ job_status: 'failed' })
      .eq('id', docId)

    return NextResponse.json({ error: 'Failed to enqueue document job' }, { status: 500 })
  }
}