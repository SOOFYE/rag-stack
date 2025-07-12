import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '../../../../utils/supabase/server'
import { SUPABASE_BUCKET_NAME } from '../../../config/supabase'

export async function GET() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: docs, error } = await supabase
    .from('user_documents')
    .select('name, object_name, type, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

    console.log(docs)

  if (error) {
    console.error('Fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }

  const signedDocuments = await Promise.all(
    docs.map(async (doc) => {
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from(SUPABASE_BUCKET_NAME)
        .createSignedUrl(doc.object_name, 60 * 60 * 24 * 7) 

      if (signedUrlError) {
        console.error(`Signed URL error for ${doc.name}:`, signedUrlError)
        return { ...doc, url: null }
      }

      return {
        ...doc,
        url: signedUrlData.signedUrl,
      }
    })
  )

  return NextResponse.json({ documents: signedDocuments })
}
