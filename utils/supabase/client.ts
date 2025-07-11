import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../src/config/supabase'
import { createBrowserClient } from '@supabase/ssr'

export const supabaseBrowserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)