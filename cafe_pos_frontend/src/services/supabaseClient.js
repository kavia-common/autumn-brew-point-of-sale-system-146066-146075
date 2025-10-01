import { createClient } from '@supabase/supabase-js';

/**
 * Returns a singleton Supabase client configured from environment variables.
 * The environment variables must be provided by the host as:
 * - REACT_APP_SUPABASE_URL
 * - REACT_APP_SUPABASE_KEY
 */
let _client = null;

// PUBLIC_INTERFACE
export function getSupabaseClient() {
  /** Create or return the cached Supabase client using env configuration. */
  if (_client) return _client;

  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;

  if (!url || !key) {
    // Provide a developer-friendly error while allowing UI to render
    // Consumers can detect absence of client via isConfigured.
    console.warn('Supabase environment variables are not set. Please configure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.');
    return null;
  }

  _client = createClient(url, key, {
    auth: {
      persistSession: true
    }
  });
  return _client;
}

// PUBLIC_INTERFACE
export function isSupabaseConfigured() {
  /** Indicates whether env variables are present for Supabase client. */
  return Boolean(process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_KEY);
}
