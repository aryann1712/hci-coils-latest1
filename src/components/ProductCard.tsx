"use client";

import {  useCart } from '@/context/CartContext';
import { ProductInterface } from '@/lib/interfaces/ProductInterface';
import Image from 'next/image';
import React from 'react'

const ProductCard = ({ product }: { product: ProductInterface }) => {
  const { addToCart } = useCart();

  return (
    <div className='rounded-md shadow-lg flex flex-col items-start justify-center gap-5'>
      {/* Image */}
      <div className="relative overflow-hidden group">
        <Image
          src={product.image}
          alt={product.name}
          height={800}
          width={800}
          className="object-cover transition-transform duration-300 group-hover:scale-110 h-[300px] rounded-t-md"
        />
      </div>
      <div className='space-y-2 p-3 '>
        {/* Name */}
        <h3 className='text-xl font-semibold'>{product.name}</h3>
        {/* Desc */}
        <p className='text-sm font-thin text-gray-400 line-clamp-3'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur, molestiae. Rem eveniet provident odit, ratione adipisci consequatur consectetur nostrum dolorem magnam voluptate quisquam facere. Esse praesentium omnis modi dolorem laborum.</p>
        {/* Buttons */}
        <div className='pt-5 px-10 flex justify-between'>
          <button
            className='bg-green-700 text-white px-5 py-2 rounded-md'
            onClick={() => console.log("enquire now")}>
            Enquire Now
          </button>
          <button
            className='bg-red-600 text-white px-5 py-2 rounded-md'
            onClick={() => addToCart({ 
              productId: product.id, 
              productName: product.name, 
              productDesc: product.description,
              productImage: product.image,
              quantity: 1 
              })}>
            Add to Cart
          </button>
        </div>
      </div>

    </div>
  );
}

export default ProductCard