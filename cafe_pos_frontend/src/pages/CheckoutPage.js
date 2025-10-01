import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { createOrder, payOrder } from '../services/posApi';
import { isSupabaseConfigured } from '../services/supabaseClient';

// PUBLIC_INTERFACE
export default function CheckoutPage() {
  /** Checkout page to finalize and pay an order. */
  const { cart, totals, clearCart } = usePOS();
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const canProceed = cart.length > 0;

  const onPay = async () => {
    setStatus('');
    setError('');
    setProcessing(true);
    try {
      if (!isSupabaseConfigured()) {
        // Simulate payment success in demo mode
        await new Promise(r => setTimeout(r, 600));
        setStatus('Payment accepted (demo).');
        clearCart();
      } else {
        const order = await createOrder(cart);
        await payOrder(order.id);
        setStatus('Payment accepted. Order completed.');
        clearCart();
      }
    } catch (e) {
      setError(e.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="row" style={{ gap: 18 }}>
      <div style={{ flex: 2 }} className="champagne-card">
        <div style={{ padding: 16 }}>
          <div className="section-title">Review Order</div>
          <div style={{ marginTop: 12 }}>
            {cart.length === 0 && <div style={{ color:'#6B7280' }}>Cart is empty. Add items from the Menu.</div>}
            {cart.map(line => (
              <div key={line.id} style={{ display:'grid', gridTemplateColumns:'1fr auto', padding:'8px 0', borderTop:'1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontWeight: 700 }}>{line.quantity} × {line.name}</div>
                <div style={{ fontWeight: 800 }}>${((line.price_cents * line.quantity)/100).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="champagne-card" style={{ marginTop: 16, padding: 12 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap: 6 }}>
              <div>Subtotal</div><div style={{ fontWeight: 700 }}>${(totals.subtotal/100).toFixed(2)}</div>
              <div>Tax (8.5%)</div><div style={{ fontWeight: 700 }}>${(totals.tax/100).toFixed(2)}</div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Total</div>
              <div style={{ fontWeight: 900, color:'var(--primary)', fontSize: 16 }}>${(totals.total/100).toFixed(2)}</div>
            </div>
            <div style={{ marginTop: 12, display:'flex', gap: 8 }}>
              <button className="btn ghost" onClick={()=>window.location.assign('/menu')}>Back</button>
              <button className="btn" onClick={onPay} disabled={!canProceed || processing}>
                {processing ? 'Processing…' : 'Pay Now'}
              </button>
            </div>
            {status && <div style={{ marginTop: 10, color: 'var(--success)' }}>{status}</div>}
            {error && <div style={{ marginTop: 10, color: 'var(--error)' }}>{error}</div>}
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} className="champagne-card">
        <div style={{ padding: 16 }}>
          <div className="section-title">Payment Method</div>
          <div style={{ marginTop: 12, display:'flex', flexDirection:'column', gap: 8 }}>
            <label><input type="radio" name="pm" defaultChecked /> Card</label>
            <label><input type="radio" name="pm" /> Cash</label>
            <label><input type="radio" name="pm" /> Other</label>
          </div>
          <div className="champagne-card" style={{ padding: 12, marginTop: 12 }}>
            <div>Elegant autumn experience</div>
            <div style={{ fontSize: 12, color:'#6B7280' }}>All transactions secured via Supabase.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
