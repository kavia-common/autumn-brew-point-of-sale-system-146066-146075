import React, { useEffect, useState } from 'react';
import { usePOS } from '../context/POSContext';
import MenuGrid from '../components/MenuGrid';
import SearchBar from '../components/SearchBar';
import CartSummary from '../components/CartSummary';
import EnvWarning from '../components/EnvWarning';
import { fetchMenuItems } from '../services/posApi';
import { isSupabaseConfigured } from '../services/supabaseClient';

const CATEGORIES = ['All', 'Coffee', 'Tea', 'Bakery', 'Seasonal'];

// PUBLIC_INTERFACE
export default function MenuPage() {
  /** Menu browsing and order building page. */
  const { addToCart, clearCart } = usePOS();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setErr('');
      try {
        if (!isSupabaseConfigured()) {
          // Fallback demo data if env not provided
          const demo = [
            { id: 'd1', name: 'Espresso', price_cents: 350, category: 'Coffee', in_stock: true },
            { id: 'd2', name: 'Cappuccino', price_cents: 475, category: 'Coffee', in_stock: true },
            { id: 'd3', name: 'Pumpkin Spice Latte', price_cents: 525, category: 'Seasonal', in_stock: true },
            { id: 'd4', name: 'Chai Latte', price_cents: 495, category: 'Tea', in_stock: true },
            { id: 'd5', name: 'Maple Pecan Scone', price_cents: 350, category: 'Bakery', in_stock: false }
          ];
          if (mounted) setItems(demo);
        } else {
          const data = await fetchMenuItems({ category: category, search });
          if (mounted) setItems(data);
        }
      } catch (e) {
        setErr(e.message || 'Failed to load menu');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [category, search]);

  const onProceed = () => {
    window.location.assign('/checkout');
  };

  return (
    <div className="row" style={{ gap: 18 }}>
      <div style={{ width: '100%', marginBottom: 8 }}>
        <EnvWarning />
      </div>
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="champagne-card" style={{ padding: 10, display:'flex', gap: 10, alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button key={c} className={`btn ${c===category ? '' : 'secondary'}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
          <div style={{ minWidth: 280 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search menu…" />
          </div>
        </div>
        {err && <div className="champagne-card" style={{ padding: 12, borderLeft: '4px solid var(--error)', color: 'var(--error)' }}>{err}</div>}
        {loading ? (
          <div className="champagne-card" style={{ padding: 18 }}>Loading menu…</div>
        ) : (
          <MenuGrid items={items} onAdd={addToCart} />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <CartSummary actions={{ onClear: clearCart, onProceed }} />
      </div>
    </div>
  );
}
