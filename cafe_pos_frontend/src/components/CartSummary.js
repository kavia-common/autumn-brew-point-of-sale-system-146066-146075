import React from 'react';
import { usePOS } from '../context/POSContext';

// PUBLIC_INTERFACE
export default function CartSummary({ actions }) {
  /** Shows the cart lines and totals with controls. */
  const { cart, totals, increment, decrement, removeFromCart, note, setNote } = usePOS();

  return (
    <div className="champagne-card" style={{ padding: 16 }}>
      <div className="section-title">Current Order</div>
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {cart.length === 0 && <div style={{ color: '#6B7280' }}>No items yet. Add from the menu.</div>}
        {cart.map(line => (
          <div key={line.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 10, alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{line.name}</div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>${(line.price_cents/100).toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button className="btn ghost" onClick={() => decrement(line.id)}>-</button>
              <div style={{ minWidth: 24, textAlign: 'center', fontWeight: 700 }}>{line.quantity}</div>
              <button className="btn ghost" onClick={() => increment(line.id)}>+</button>
            </div>
            <div style={{ fontWeight: 700 }}>${((line.price_cents * line.quantity)/100).toFixed(2)}</div>
            <button className="btn secondary" onClick={() => removeFromCart(line.id)}>Remove</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <label style={{ fontSize: 12, color: '#6B7280' }}>Order notes</label>
        <textarea className="input" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add special instructions…" />
      </div>

      <div className="champagne-card" style={{ padding: 14, marginTop: 16 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap: 6 }}>
          <div>Subtotal</div><div style={{ fontWeight: 700 }}>${(totals.subtotal/100).toFixed(2)}</div>
          <div>Tax</div><div style={{ fontWeight: 700 }}>${(totals.tax/100).toFixed(2)}</div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Total</div>
          <div style={{ fontWeight: 900, color: 'var(--primary)', fontSize: 16 }}>${(totals.total/100).toFixed(2)}</div>
        </div>
        <div style={{ display:'flex', gap: 8, marginTop: 12 }}>
          <button className="btn ghost" onClick={actions.onClear}>Clear</button>
          <button className="btn" onClick={actions.onProceed} disabled={cart.length===0}>Proceed to Pay</button>
        </div>
      </div>
    </div>
  );
}
