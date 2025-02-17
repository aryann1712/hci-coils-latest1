"use client";
import { useCart } from "@/context/CartContext";
import { CartItemType } from "@/lib/interfaces/CartInterface";
import Image from "next/image";
import React from "react";
import { MdDelete } from "react-icons/md";

interface CartProductItemCardProps {
  cardData: CartItemType;
}

const CartProductItemCard: React.FC<CartProductItemCardProps> = ({
  cardData,

}) => {
  const { addToCart, decrementToCart, updateProductToCart, removeFromCart } = useCart();

  /**
   * Called when user manually types a new quantity in the input.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const newQty = parseInt(e.target.value, 10);
    cardData.quantity = newQty;
    if (!isNaN(newQty) && newQty >= 0) {
      updateProductToCart?.(cardData);
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
          className="h-[200px] w-[350px] rounded-md object-cover"
        />
      </div>

      {/* Name and Description */}
      <div className="col-span-2 flex flex-col px-4">
        <h1 className="text-lg font-semibold">{cardData.productName}</h1>
        <p className="text-sm text-gray-600">{cardData.productDesc}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex gap-8 items-end">
        <div className="flex flex-col space-y-2 items-center justify-center">
          <h3 className="text-sm font-semibold text-gray-500">Qty.</h3>
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
              type="text"
              className="w-12 text-center border border-gray-300 rounded appearance-none outline-none focus:ring-2 focus:ring-blue-500"
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
        <MdDelete className="text-2xl mb-1 text-gray-500 hover:text-black" onClick={() => removeFromCart(cardData.productId)}/>
      </div>
    </div>
  );
};

export default CartProductItemCard;
