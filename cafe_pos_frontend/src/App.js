import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';
import CheckoutPage from './pages/CheckoutPage';
import InventoryPage from './pages/InventoryPage';
import { POSProvider } from './context/POSContext';

// Elegant Champagne Nav
function NavBar() {
  return (
    <div style={{ background: 'var(--gradient)' }}>
      <nav className="container"
           style={{ display: 'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'white', display:'grid', placeItems:'center',
            boxShadow: 'var(--shadow-s)', border: '1px solid rgba(0,0,0,0.06)'
          }}>
            <span role="img" aria-label="leaf">🍂</span>
          </div>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text)' }}>Autumn Brew POS</div>
            <div className="badge">Champagne</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <NavLink to="/menu" className="btn ghost">Menu</NavLink>
          <NavLink to="/orders" className="btn ghost">Orders</NavLink>
          <NavLink to="/checkout" className="btn ghost">Checkout</NavLink>
          <NavLink to="/inventory" className="btn">Inventory</NavLink>
        </div>
      </nav>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <POSProvider>
      <BrowserRouter>
        <NavBar />
        <main className="container" style={{ paddingTop: 18, paddingBottom: 40 }}>
          <div className="row">
            <div className="champagne-surface" style={{ width:'100%', padding: 18 }}>
              <Routes>
                <Route path="/" element={<Navigate to="/menu" replace />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="*" element={<div>Not Found</div>} />
              </Routes>
            </div>
          </div>
        </main>
      </BrowserRouter>
    </POSProvider>
  );
}

export default App;
