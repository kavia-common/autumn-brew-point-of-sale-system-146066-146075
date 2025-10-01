import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import InventoryTable from '../components/InventoryTable';
import { adjustInventory, fetchInventory } from '../services/posApi';
import { isSupabaseConfigured } from '../services/supabaseClient';

// PUBLIC_INTERFACE
export default function InventoryPage() {
  /** Inventory management view. */
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      if (!isSupabaseConfigured()) {
        const demo = [
          { id: 'i1', sku: 'ESP-001', name: 'Espresso Beans', quantity: 24 },
          { id: 'i2', sku: 'MLK-001', name: 'Oat Milk', quantity: 12 }
        ];
        setRows(demo);
      } else {
        const data = await fetchInventory({ search });
        setRows(data);
      }
    } catch (e) {
      setErr(e.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search]);

  const onAdjust = async (id, delta) => {
    try {
      if (!isSupabaseConfigured()) {
        setRows(prev => prev.map(r => r.id === id ? { ...r, quantity: Math.max(0, r.quantity + delta) } : r));
      } else {
        const updated = await adjustInventory(id, delta);
        setRows(prev => prev.map(r => r.id === id ? updated : r));
      }
    } catch (e) {
      setErr(e.message || 'Failed to adjust inventory');
    }
  };

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="row" style={{ gap: 12 }}>
        <div style={{ flex: 1 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search inventory…" />
        </div>
        <button className="btn" onClick={load}>Refresh</button>
      </div>
      {err && <div className="champagne-card" style={{ padding: 12, borderLeft:'4px solid var(--error)', color:'var(--error)' }}>{err}</div>}
      {loading ? <div className="champagne-card" style={{ padding: 12 }}>Loading…</div> : <InventoryTable items={rows} onAdjust={onAdjust} />}
    </div>
  );
}
