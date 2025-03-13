"use client";
import { useCart } from "@/context/CartContext";
import { CartItemType } from "@/lib/interfaces/CartInterface";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { MdDelete } from "react-icons/md";

interface CartProductItemCardProps {
  cardData: CartItemType;
}

const CartProductItemCard: React.FC<CartProductItemCardProps> = ({
  cardData,

}) => {
  const { addToCart, removeFromCart } = useCart();
  const router = useRouter();

  /**
   * Called when user manually types a new quantity in the input.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQty = parseInt(e.target.value, 10);
    if(newQty >= 1) {
      cardData.quantity  = newQty;
      addToCart(cardData);
    }
  };



  return (
    <div className="grid grid-cols-4 items-center py-5 md:px-5 border-b">
      {/* Image */}
      <div>
        <Image
          src={cardData.images[0] || "/logo.png"}
          alt={cardData.name}
          width={1000}
          height={1000}
          className="h-[70px] w-[100px] md:h-[200px] md:w-[350px] rounded-md object-cover cursor-pointer"
          onClick={() => router.push(`/products/${cardData._id}`)}
        />
      </div>

      {/* Name and Description */}
      <div className="col-span-2 flex flex-col px-4 cursor-pointer h-full  md:gap-y-5 justify-center" onClick={() => router.push(`/products/${cardData._id}`)}>
        <h1 className="text-sm md:text-lg font-semibold">{cardData.name}</h1>
        <p className="text-xs md:text-sm text-gray-600 line-clamp-2 md:line-clamp-3">{cardData.description}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8 md:items-end">
        <div className="flex flex-col space-y-2 items-center justify-center">
          <h3 className="text-xs md:text-sm font-semibold text-gray-500">Qty.</h3>
          <div className="flex items-center justify-end gap-2">
            {/* Decrement Button */}
            <button
              onClick={() => {
                cardData.quantity--;
                return addToCart(cardData);
              }}
              disabled={cardData.quantity <= 1}
              className={`w-4 h-4 md:w-8 md:h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:bg-gray-100 transition`}
            >
              –
            </button>

            {/* Editable Quantity Input */}
            <input
              type="text"
              className="w-6 md:w-12 text-xs md:text-base text-center border border-gray-300 rounded appearance-none outline-none focus:ring-2 focus:ring-blue-500"
              value={cardData.quantity}
              onChange={handleChange}
            />

            {/* Increment Button */}
            <button
              onClick={() => {
                cardData.quantity++;
                return addToCart(cardData);
              }}
              className="w-4 h-4 md:w-8 md:h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
            >
              +
            </button>
          </div>
        </div>
        <MdDelete className="text-2xl mb-1 text-gray-500 hover:text-black" onClick={() => removeFromCart(cardData._id)} />
      </div>
    </div>
  );
};

export default CartProductItemCard;
