import { createClient } from "@supabase/supabase-js";

// gets the Supabase project URL from .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// anon key btw is the API key
// gets the Supabase anon public key from .env or .env.local whatever you use.
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Creates and exports the Supabase client for the app.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);