import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dzxrzudjztteafmridkv.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_IaI6m8delqSCiTqp6T6b_g_sNnoXAKy'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const auth = supabase.auth

export default supabase