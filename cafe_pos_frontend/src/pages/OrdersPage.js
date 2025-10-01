import React, { useEffect, useState } from 'react';
import { fetchOpenOrders } from '../services/posApi';
import { isSupabaseConfigured } from '../services/supabaseClient';

// PUBLIC_INTERFACE
export default function OrdersPage() {
  /** Displays recent orders. */
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setErr('');
      try {
        if (!isSupabaseConfigured()) {
          const demoOrders = [
            { id: 'o1', created_at: new Date().toISOString(), status: 'paid', total_cents: 1200, order_items: [] },
            { id: 'o2', created_at: new Date().toISOString(), status: 'open', total_cents: 485, order_items: [] }
          ];
          if (mounted) setOrders(demoOrders);
        } else {
          const data = await fetchOpenOrders();
          if (mounted) setOrders(data);
        }
      } catch (e) {
        setErr(e.message || 'Failed to load orders');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; }
  }, []);

  return (
    <div className="col">
      <div className="section-title">Recent Orders</div>
      {err && <div className="champagne-card" style={{ padding: 12, borderLeft: '4px solid var(--error)', color: 'var(--error)' }}>{err}</div>}
      {loading ? (
        <div className="champagne-card" style={{ padding: 18 }}>Loading orders…</div>
      ) : (
        <div className="champagne-card" style={{ padding: 12 }}>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', color:'#6B7280', fontWeight:700, padding:'8px 6px' }}>
            <div>Order ID</div>
            <div>Created</div>
            <div>Status</div>
            <div>Total</div>
          </div>
          {orders.map(o => (
            <div key={o.id} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', alignItems:'center', padding:'10px 6px', borderTop:'1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontFamily:'monospace' }}>{o.id}</div>
              <div>{new Date(o.created_at).toLocaleString()}</div>
              <div><span className="badge">{o.status}</span></div>
              <div style={{ fontWeight:800 }}>${(o.total_cents/100).toFixed(2)}</div>
            </div>
          ))}
          {orders.length===0 && <div style={{ color:'#6B7280', padding: 10 }}>No orders yet.</div>}
        </div>
      )}
    </div>
  );
}
