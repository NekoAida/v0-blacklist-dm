import { createClient } from '@supabase/supabase-js'

// Clean up the URL in case it has /rest/v1/ appended to it from the dashboard copy-paste
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
if (supabaseUrl.endsWith('/rest/v1/')) {
  supabaseUrl = supabaseUrl.replace('/rest/v1/', '')
}

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Initialize client only if we have the required variables to avoid crashing the whole page
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co", 
  supabaseAnonKey || "placeholder"
)