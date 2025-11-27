"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage once
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {
        setCart([]);
      }
    }
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ IMPORTANT: respects quantity passed in
  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);

      if (existing) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, qty: item.qty + qty }   // 🔥 add selected quantity
            : item
        );
      }

      return [...prev, { ...product, qty }];       // 🔥 first time uses qty
    });
  };

  const updateQty = (id, qty) => {
    setCart(prev =>
      prev.map(item =>
        item._id === id ? { ...item, qty: Math.max(1, qty) } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQty, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
