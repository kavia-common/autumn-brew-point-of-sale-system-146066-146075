import React from 'react';

// PUBLIC_INTERFACE
export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  /** Minimal elegant search bar. */
  return (
    <div className="champagne-card" style={{ padding: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
      <span role="img" aria-label="search">🔎</span>
      <input className="input" value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}
