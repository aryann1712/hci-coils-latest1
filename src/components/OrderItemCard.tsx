"use client";
import { OrderItemType } from '@/lib/interfaces/OrderInterface'
import Image from 'next/image'
import { FaReply } from "react-icons/fa";
import React from 'react'
import { useCart } from '@/context/CartContext';

const OrderItemCard = ({ orderItem }: { orderItem: OrderItemType }) => {
    const { cartItems, addToCart } = useCart();
  

  const addItemsToCart = (() => {
    for(let item of orderItem.products) {
      addToCart(item);
    }
  });

  return (
    <div className='shadow-md rounded-md my-5 py-5 px-5 border-dashed border flex flex-row gap-5 items-center justify-center'>
      <div className=''>
        <div className='text-sm text-gray-400'>
          <h1>Order Id: {orderItem.orderId}</h1>
          <h1>Purchase Data: {orderItem.orderDate}</h1>
          <h1>GST No: {orderItem.gstNumber}</h1>

        </div>
        {orderItem.products.map((item, index) =>
        (
          <div key={index} className='grid grid-cols-4 items-center py-5 px-5 border-b'>
            {/* Image */}
            <div>
              <Image
                src={item.productImage}
                alt={item.productName}
                width={1000}
                height={1000}
                className="h-[100px] w-[150px] rounded-md object-cover"
              />
            </div>

            {/* Name and Description */}
            <div className="col-span-2 flex flex-col px-4">
              <h1 className="text-lg font-semibold">{item.productName}</h1>
              <p className="text-sm text-gray-600 line-clamp-3">{item.productDesc}</p>
            </div>

            {/* Quantity */}
            <div className="flex flex-col justify-center">
              <h1 className="text-xs  text-gray-400 font-semibold">Qty</h1>
              <h1 className="text-lg font-semibold">{item.quantity}</h1>
            </div>

          </div>
        ))}
      </div>
      <div className='group' >
        <div className='min-w-[200px] flex flex-col justify-center items-center cursor-pointer gap-y-2' onClick={() => addItemsToCart()}>
          <FaReply className='text-4xl text-gray-400 group-hover:text-red-500' />
          <h1 className='font-semibold group-hover:text-red-500'>Add to cart</h1>
        </div>
      </div>
    </div>
  )
}

export default OrderItemCard