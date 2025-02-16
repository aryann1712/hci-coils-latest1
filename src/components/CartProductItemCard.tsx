"use client";
import { useCart } from "@/context/CartContext";
import { CartItemType } from "@/lib/interfaces/CartInterface";
import Image from "next/image";
import React from "react";

interface CartProductItemCardProps {
  cardData: CartItemType;
  onIncrement?: (productId: number) => void;
  onDecrement?: (productId: number) => void;
  onUpdateQuantity?: (productId: number, newQty: number) => void;
}

const CartProductItemCard: React.FC<CartProductItemCardProps> = ({
  cardData,
  onIncrement,
  onDecrement,
  onUpdateQuantity,
}) => {
    const { addToCart, cartItems, removeFromCart, decrementToCart } = useCart();

  /**
   * Called when user manually types a new quantity in the input.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    const newQty = parseInt(e.target.value, 10);
    // Ensure it's a valid, non-negative number
    if (!isNaN(newQty) && newQty >= 0) {
      onUpdateQuantity?.(cardData.productId, newQty);
    }
  };

  return (
    <div className="grid grid-cols-4 items-center py-5 px-5 border-b">
      {/* Image */}
      <div>
        <Image
          src={cardData.productImage}
          alt={cardData.productName}
          width={1000}
          height={1000}
          className="h-[200px] w-auto object-cover"
        />
      </div>

      {/* Name and Description */}
      <div className="col-span-2 flex flex-col px-4">
        <h1 className="text-lg font-semibold">{cardData.productName}</h1>
        <p className="text-sm text-gray-600">{cardData.productDesc}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center justify-end gap-2">
        {/* Decrement Button */}
        <button
          onClick={() => decrementToCart(cardData.productId)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
        >
          –
        </button>

        {/* Editable Quantity Input */}
        <input
          type="number"
          className="w-12 text-center border border-gray-300 rounded"
          value={cardData.quantity}
          onChange={handleChange}
        />

        {/* Increment Button */}
        <button
          onClick={() => addToCart(cardData)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CartProductItemCard;
