import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'motofix_cart';

// Cart lives client-side (localStorage) rather than as its own backend
// resource — checkout is a single atomic call anyway (see paymentController
// .initOrderPayment), which re-validates every price and stock level
// against the DB regardless of what's stored here.
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (part, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.partId === part._id);
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, part.stock);
        return prev.map((i) => (i.partId === part._id ? { ...i, quantity: nextQty, stock: part.stock } : i));
      }
      return [
        ...prev,
        {
          partId: part._id,
          name: part.name,
          price: part.price,
          vendorName: part.vendorName,
          stock: part.stock,
          quantity: Math.min(quantity, part.stock),
        },
      ];
    });
  };

  const updateQuantity = (partId, quantity) => {
    setItems((prev) =>
      prev.map((i) => (i.partId === partId ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i))
    );
  };

  const removeItem = (partId) => setItems((prev) => prev.filter((i) => i.partId !== partId));

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
