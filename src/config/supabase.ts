export const SUPABASE_URL: string = process.env.NEXT_PUBLIC_SUPABASE_URL as string
export const SUPABASE_ANON_KEY: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
export const SUPABASE_BUCKET_NAME: string = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME as string
export const SUPABASE_SERVICE_ROLE_KEY: string = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY as string

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables")
}