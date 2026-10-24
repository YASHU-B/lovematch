import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceKey));

let supabaseClientInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  if (!supabaseClientInstance) {
    supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false }
    });
  }
  return supabaseClientInstance;
}

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || (!supabaseServiceKey && !supabaseAnonKey)) {
    return null;
  }
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(supabaseUrl, (supabaseServiceKey || supabaseAnonKey)!, {
      auth: { persistSession: false }
    });
  }
  return supabaseAdminInstance;
}
