import React, { createContext, useContext, useMemo, useState } from 'react';

const POSContext = createContext(null);

// PUBLIC_INTERFACE
export function usePOS() {
  /** Hook to access POS context. */
  const ctx = useContext(POSContext);
  if (!ctx) throw new Error('usePOS must be used within POSProvider');
  return ctx;
}

// PUBLIC_INTERFACE
export function POSProvider({ children }) {
  /** Provides cart and POS actions across the app. */
  const [cart, setCart] = useState([]); // [{ id, name, price_cents, quantity }]
  const [note, setNote] = useState('');

  const addToCart = (item) => {
    setCart(prev => {
      const found = prev.find(p => p.id === item.id);
      if (found) {
        return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const increment = (id) => setCart(prev => prev.map(p => p.id === id ? { ...p, quantity: p.quantity + 1 } : p));
  const decrement = (id) => setCart(prev => prev.flatMap(p => {
    if (p.id !== id) return [p];
    const q = Math.max(0, p.quantity - 1);
    return q === 0 ? [] : [{ ...p, quantity: q }];
  }));

  const clearCart = () => setCart([]);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, it) => sum + it.price_cents * it.quantity, 0);
    const tax = Math.round(subtotal * 0.085);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [cart]);

  const value = {
    cart,
    note,
    setNote,
    addToCart,
    removeFromCart,
    increment,
    decrement,
    clearCart,
    totals
  };

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
}
