import React from 'react';
import { isSupabaseConfigured } from '../services/supabaseClient';

// PUBLIC_INTERFACE
export default function EnvWarning() {
  /** Show a banner if Supabase env is not configured. */
  if (isSupabaseConfigured()) return null;
  return (
    <div className="champagne-card" style={{ padding: 12, borderLeft: '4px solid var(--primary)', background: '#FFFBEB' }}>
      <strong>Demo mode:</strong> Supabase env vars are missing. Using in-memory demo data. Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY in .env.
    </div>
  );
}
