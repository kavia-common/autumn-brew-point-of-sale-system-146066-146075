import React from 'react';

// PUBLIC_INTERFACE
export default function InventoryTable({ items, onAdjust }) {
  /** Displays inventory list with quick +/- buttons. */
  return (
    <div className="champagne-card" style={{ padding: 12 }}>
      <div className="section-title">Inventory</div>
      <div style={{ marginTop: 10 }}>
        <div style={{ display:'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', fontWeight: 700, padding: '8px 6px', color: '#6B7280' }}>
          <div>Name</div>
          <div>SKU</div>
          <div>Qty</div>
          <div>Adjust</div>
        </div>
        {items.map(row => (
          <div key={row.id} style={{ display:'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '10px 6px', alignItems:'center', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <div>{row.name}</div>
            <div>{row.sku}</div>
            <div style={{ fontWeight: 800 }}>{row.quantity}</div>
            <div style={{ display:'flex', gap: 8 }}>
              <button className="btn secondary" onClick={()=>onAdjust(row.id, -1)}>-1</button>
              <button className="btn" onClick={()=>onAdjust(row.id, +1)}>+1</button>
            </div>
          </div>
        ))}
        {items.length===0 && <div style={{ color:'#6B7280', padding: 12 }}>No inventory records.</div>}
      </div>
    </div>
  );
}
