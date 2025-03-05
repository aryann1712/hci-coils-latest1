// src/context/CartContext.tsx
"use client";
import { CartItemType } from "@/lib/interfaces/CartInterface";
import { createContext, useContext, useEffect, useState } from "react";

interface CartContextType {
  cartItems: CartItemType[];
  setAllToCart: (items: CartItemType[]) => void;
  addToCart: (item: CartItemType) => void;
  decrementToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  updateProductToCart: (item: CartItemType) => void;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  setAllToCart: () => {},
  addToCart: () => {},
  decrementToCart: () => {},
  removeFromCart: () => {},
  updateProductToCart: () => {},
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

  const setAllToCart = (items: CartItemType[]) => {
    setCartItems(items);
  };

  const addToCart = async (item: CartItemType) => {
    console.log("adding to cart");

    


    setCartItems((prev) => {
      const existingItem = prev.find(c => c._id === item._id);
      if (existingItem) {
        return prev.map(c =>
          c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, item];
    });
  };

  const updateProductToCart = (item: CartItemType) => {
    console.log("updating to cart");
    setCartItems((prev) => {
      const existingItem = prev.find(c => c._id === item._id);
      if (existingItem) {
        return prev.map(c =>
          c._id === item._id ? { ...c, quantity: item.quantity } : c
        );
      }
      return [...prev, item];
    });
  };

  const decrementToCart = (id: string) => {
    console.log("decrement to cart");
    setCartItems((prev) => {
      const existingItem = prev.find(c => c._id === id);
      if (existingItem) {
        if (existingItem.quantity <= 1) {
          return prev.filter((c) => c._id !== id);
        }
        return prev.map(c =>
          c._id === id ? { ...c, quantity: c.quantity - 1 } : c
        );
      }
      return prev;
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, setAllToCart, addToCart, removeFromCart, decrementToCart, updateProductToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
