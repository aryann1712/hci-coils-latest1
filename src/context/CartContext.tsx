// src/context/CartContext.tsx
"use client";
import { CartItemType } from "@/lib/interfaces/CartInterface";
import { createContext, useContext, useEffect, useState } from "react";

interface CartContextType {
  cartItems: CartItemType[];
  addToCart: (item: CartItemType) => void;
  decrementToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  decrementToCart: () => {},
  removeFromCart: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Initialize cart state from localStorage (if available)
  const [cartItems, setCartItems] = useState<CartItemType[]>(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cartItems");
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  // Update localStorage whenever the cartItems state changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItemType) => {
    console.log("adding to cart");
    setCartItems((prev) => {
      const existingItem = prev.find(c => c.productId === item.productId);
      if (existingItem) {
        return prev.map(c =>
          c.productId === item.productId ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, item];
    });
  };

  const decrementToCart = (id: number) => {
    console.log("decrement to cart");
    setCartItems((prev) => {
      const existingItem = prev.find(c => c.productId === id);
      if (existingItem) {
        if (existingItem.quantity <= 1) {
          return prev.filter((c) => c.productId !== id);
        }
        return prev.map(c =>
          c.productId === id ? { ...c, quantity: c.quantity - 1 } : c
        );
      }
      return prev;
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((c) => c.productId !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, decrementToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
