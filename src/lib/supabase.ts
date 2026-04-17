import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = 
  !!supabaseUrl && 
  !!supabaseAnonKey && 
  supabaseUrl.startsWith('http') && 
  supabaseAnonKey.length > 20; // Basic check for JWT length

// Use a Proxy to prevent the app from crashing at module load if keys are missing or invalid.
// This allows the app to start and show a helpful error message or loading state.
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as any, {
      get(_, prop) {
        if (prop === 'then') return undefined; // Handle async/await checks
        throw new Error(
          'Supabase is not configured. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the environment variables via the Settings menu.'
        );
      }
    });

export const hasSupabaseConfig = isConfigured;
