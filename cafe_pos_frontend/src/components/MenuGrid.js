import React from 'react';

// PUBLIC_INTERFACE
export default function MenuGrid({ items, onAdd }) {
  /** Displays menu items as elegant cards in a grid. */
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
      gap: 16
    }}>
      {items.map(item => (
        <div key={item.id} className="champagne-card" style={{ padding: 14 }}>
          <div style={{ borderRadius: 12, overflow: 'hidden', background: '#FFF7ED', aspectRatio: '4/3',
            display: 'grid', placeItems: 'center', marginBottom: 10, border: '1px solid rgba(0,0,0,0.04)' }}>
            <span style={{ fontSize: 28 }}>☕</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems:'center', gap: 10 }}>
            <div>
              <div style={{ fontWeight: 700 }}>{item.name}</div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>{item.category}</div>
            </div>
            <div style={{ fontWeight: 800, color: 'var(--primary)' }}>${(item.price_cents/100).toFixed(2)}</div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
            <div className="badge">{item.in_stock ? 'In stock' : 'Out'}</div>
            <button className="btn" onClick={() => onAdd(item)} disabled={!item.in_stock}>
              Add
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
