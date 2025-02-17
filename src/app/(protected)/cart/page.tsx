"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import CartProductItemCard from "@/components/CartProductItemCard";

const CartPage: React.FC = () => {
  const { cartItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Until the component is mounted, you can render a placeholder or nothing.
  if (!mounted) {
    return null;
  }

  return (
    <div>
      {cartItems.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        cartItems.map((item) => (
          <CartProductItemCard key={item.productId} cardData={item} />
        ))
      )}
    </div>
  );
};

export default CartPage;
