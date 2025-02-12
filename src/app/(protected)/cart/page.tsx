// src/app/(protected)/cart/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  // On mount, load cart from localStorage or global store
  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      setCartItems(JSON.parse(cartData));
    }
  }, []);

  const handleSubmitEnquiry = () => {
    // 1. Generate unique enquiry ID
    // 2. Call an API route to send email to admin & user
    // 3. Clear cart or keep it?
  };

  return (
    <div className="p-4">
      <h2>Your Cart</h2>
      {cartItems.map((item) => (
        <div key={item.productId} className="mb-2">
          <p>{item.productName}</p>
          <p>Qty: {item.quantity}</p>
        </div>
      ))}

      <div className="mt-4 flex gap-4">
        <button
          onClick={handleSubmitEnquiry}
          className="bg-green-500 text-white px-4 py-2"
        >
          Submit Enquiry
        </button>
        <button
          onClick={() => {} /* handle place order similarly */}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

interface CartItemType {
  productId: number;
  productName: string;
  quantity: number;
}
