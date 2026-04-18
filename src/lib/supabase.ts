import { createClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// On utilise les clés fournies par l'utilisateur si elles sont valides, sinon on utilise les clés par défaut
const supabaseUrl = (envUrl && envUrl.startsWith('http')) 
  ? envUrl 
  : 'https://pngxwqnzebhdbrxlfvzk.supabase.co';

const supabaseAnonKey = (envKey && envKey.length > 20) 
  ? envKey 
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuZ3h3cW56ZWJoZGJyeGxmdnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxODYyNjEsImV4cCI6MjA5MTc2MjI2MX0.yqiIMP3Hj_ZqIuptbuNhnAuSWozSAoBAWWbMrgbBP78';

const isConfigured = true; // On force à vrai puisqu'on a des fallbacks valides

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

export const configStatus = {
  url: !!supabaseUrl && supabaseUrl.startsWith('http'),
  key: !!supabaseAnonKey && supabaseAnonKey.length > 20,
  isConfigured
};

export const hasSupabaseConfig = isConfigured;
