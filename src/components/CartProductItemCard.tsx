"use client";
import { useCart } from "@/context/CartContext";
import { CartItemType } from "@/lib/interfaces/CartInterface";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";

interface CartProductItemCardProps {
  cardData: CartItemType;
}

const CartProductItemCard: React.FC<CartProductItemCardProps> = ({
  cardData,
}) => {
  const { updateProductToCart, removeFromCart } = useCart();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(cardData.quantity);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQty = parseInt(e.target.value, 10);
    if (newQty >= 1 && !isUpdating) {
      setLocalQuantity(newQty);
      setIsUpdating(true);
      try {
        await updateProductToCart({
          ...cardData,
          quantity: newQty
        });
        toast.success('Quantity updated successfully!', {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#4CAF50',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
          icon: '🔄',
        });
      } catch (error) {
        setLocalQuantity(cardData.quantity);
        if (error instanceof Error && 
            error.message !== "Cart not found" && 
            error.message !== "Product can not be less than 1 Unit.") {
          toast.error('Failed to update quantity', {
            duration: 2000,
            position: 'top-right',
            style: {
              background: '#f44336',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
            icon: '❌',
          });
        }
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleIncrement = async () => {
    if (isUpdating) return;
    const newQty = localQuantity + 1;
    setLocalQuantity(newQty);
    setIsUpdating(true);
    try {
      await updateProductToCart({
        ...cardData,
        quantity: newQty
      });
      toast.success('Quantity increased!', {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#4CAF50',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
        icon: '➕',
      });
    } catch (error) {
      setLocalQuantity(cardData.quantity);
      if (error instanceof Error && 
          error.message !== "Cart not found" && 
          error.message !== "Product can not be less than 1 Unit.") {
        toast.error('Failed to update quantity', {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#f44336',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
          icon: '❌',
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrement = async () => {
    if (isUpdating) return;
    if (localQuantity > 1) {
      const newQty = localQuantity - 1;
      setLocalQuantity(newQty);
      setIsUpdating(true);
      try {
        await updateProductToCart({
          ...cardData,
          quantity: newQty
        });
        toast.success('Quantity decreased!', {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#4CAF50',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
          icon: '➖',
        });
      } catch (error) {
        setLocalQuantity(cardData.quantity);
        if (error instanceof Error && 
            error.message !== "Cart not found" && 
            error.message !== "Product can not be less than 1 Unit.") {
          toast.error('Failed to update quantity', {
            duration: 2000,
            position: 'top-right',
            style: {
              background: '#f44336',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
            icon: '❌',
          });
        }
      } finally {
        setIsUpdating(false);
      }
    } else {
      toast.error('Minimum quantity is 1', {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#f44336',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
        icon: '⚠️',
      });
    }
  };

  const handleRemove = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await removeFromCart(cardData._id);
      toast.success('Item removed from cart!', {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#4CAF50',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
        icon: '🗑️',
      });
    } catch (error) {
      if (error instanceof Error && 
          error.message !== "Cart not found" && 
          error.message !== "Product can not be less than 1 Unit.") {
        toast.error('Failed to remove item', {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#f44336',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
          icon: '❌',
        });
      }
    } finally {
      setIsUpdating(false);
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
      <div className="col-span-2 flex flex-col px-4 cursor-pointer h-full md:gap-y-5 justify-center" onClick={() => router.push(`/products/${cardData._id}`)}>
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
              onClick={handleDecrement}
              disabled={localQuantity <= 1 || isUpdating}
              className={`w-4 h-4 md:w-8 md:h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:bg-gray-100 disabled:opacity-50 transition`}
            >
              –
            </button>

            {/* Editable Quantity Input */}
            <input
              type="text"
              className="w-6 md:w-12 text-xs md:text-base text-center border border-gray-300 rounded appearance-none outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              value={localQuantity}
              onChange={handleChange}
              disabled={isUpdating}
            />

            {/* Increment Button */}
            <button
              onClick={handleIncrement}
              disabled={isUpdating}
              className="w-4 h-4 md:w-8 md:h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 transition"
            >
              +
            </button>
          </div>
        </div>
        <MdDelete 
          className={`text-2xl mb-1 text-gray-500 hover:text-black cursor-pointer ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={handleRemove}
        />
      </div>
    </div>
  );
};

export default CartProductItemCard;
