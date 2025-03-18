// src/context/CartContext.tsx
"use client";
import { CartItemType, CustomCoilItemType, FinalCartItem } from "@/lib/interfaces/CartInterface";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

interface CartContextType {
  cartItems: FinalCartItem[];
  setAllToCart: (items: FinalCartItem[]) => void;
  addToCart: (item: CartItemType) => void;
  addCustomCoilToCart: (customCoil: CustomCoilItemType) => void;
  updateCustomCoilToCart: (customCoil: CustomCoilItemType) => void;
  decrementToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  updateProductToCart: (item: CartItemType) => void;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  setAllToCart: () => {},
  addToCart: () => {},
  addCustomCoilToCart: () => {},
  updateCustomCoilToCart: () => {},
  decrementToCart: () => {},
  removeFromCart: () => {},
  updateProductToCart: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState<FinalCartItem[]>(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cartItems");
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const setAllToCart = (items: FinalCartItem[]) => {
    setCartItems(items);
  };

  const addToCart = async (item: CartItemType) => {
    console.log("adding/removing to cart", item);
    if (user?.userId) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user.userId,
          productId: item._id,
          quantity: item.quantity,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Adding To Cart Failed");
        console.log(data.error || "Adding To Cart Failed");
      } else {
        console.log("Product added successfully");
      }
    }
  };

  const addCustomCoilToCart = async (item: CustomCoilItemType) => {
    console.log("adding/removing to cart", item);
    if (user?.userId) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/addCustomCoil`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Adding To Cart Failed");
        console.log(data.error || "Adding To Cart Failed");
      } else {
        console.log("Product added successfully");
      }
    }
  };

  const updateProductToCart = (item: CartItemType) => {
    console.log("updating to cart");
    setCartItems((prev) =>
      prev.map((c) => (c.items.some((i) => i._id === item._id) ? { ...c, items: c.items.map((i) => (i._id === item._id ? { ...i, quantity: item.quantity } : i)) } : c))
    );
  };

  const updateCustomCoilToCart = (item: CustomCoilItemType) => {
    console.log("updating custom coil in cart");
    setCartItems((prev) =>
      prev.map((c) => ({
        ...c,
        customCoils: c.customCoils.map((coil) =>
          coil.coilType === item.coilType ? { ...coil, quantity: item.quantity } : coil
        ),
      }))
    );
  };

  const decrementToCart = (id: string) => {
    console.log("decrement to cart");
    setCartItems((prev) =>
      prev.map((c) =>
        c.items.some((i) => i._id === id)
          ? {
              ...c,
              items: c.items
                .map((i) => (i._id === id ? { ...i, quantity: i.quantity - 1 } : i))
                .filter((i) => i.quantity > 0),
            }
          : c
      )
    );
  };

  const removeFromCart = async (id: string) => {
    console.log("removing from the cart with productId", id);
    if (user?.userId) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.userId }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Deleting From Cart Failed");
        console.log(data.error || "Deleting From Cart Failed");
      } else {
        console.log("Product Deleted successfully");
      }
    }
    setCartItems((prev) => prev.map((c) => ({ ...c, items: c.items.filter((i) => i._id !== id) })));
  };

  return (
    <CartContext.Provider value={{ cartItems, setAllToCart, addToCart, addCustomCoilToCart, updateCustomCoilToCart, decrementToCart, removeFromCart, updateProductToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
