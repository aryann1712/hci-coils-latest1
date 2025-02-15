"use client";

import { CartItem, useCart } from '@/context/CardContext';
import Image from 'next/image';
import React from 'react'

const ProductCard = ({ product }: { product: CartItem }) => {
  const { addToCart } = useCart();

  return (
    <div className='p-3 rounded-md shadow-lg flex flex-col items-start justify-center gap-5'>
      {/* Image */}
      <div>
        <Image src="https://stimg.cardekho.com/images/carexteriorimages/930x620/Maruti/Dzire/11387/1731318279714/front-left-side-47.jpg" alt='' height={1000} width={1000} className='rounded-lg' />
      </div>

      <div className='space-y-2'>
        {/* Name */}
        <h3 className='text-xl font-semibold'>Condensing Artwork</h3>
        {/* Desc */}
        <p className='text-sm font-thin text-gray-400 line-clamp-3'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur, molestiae. Rem eveniet provident odit, ratione adipisci consequatur consectetur nostrum dolorem magnam voluptate quisquam facere. Esse praesentium omnis modi dolorem laborum.</p>
        {/* Buttons */}
        <div className='pt-5 flex justify-evenly'>
          <button
            className='bg-green-700 text-white px-5 py-2 rounded-md'
            onClick={() => console.log("enquire now")}>
            Enquire Now
          </button>
          <button
            className='bg-red-600 text-white px-5 py-2 rounded-md'
            onClick={() => addToCart({ id: product.id, name: product.name, quantity: 1 })}>
            Add to Cart
          </button>
        </div>
      </div>

    </div>
  );
}

export default ProductCard