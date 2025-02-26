"use client";

import { useCart } from '@/context/CartContext';
import { ProductAllTypeInterfact } from '@/data/allProducts';
import Image from 'next/image';

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";


const ProductCard = ({ product, showHover=true }: { product: ProductAllTypeInterfact, showHover? : boolean }) => {
  const { addToCart } = useCart();

  return (
    <div className='w-96 rounded-md shadow-lg flex flex-col items-start justify-center gap-5'>
      {/* Image */}
      <div className="relative overflow-hidden group">
        <Carousel className="w-full">
          <CarouselContent>
            {product.imagePaths.map((item, index) => (
              <CarouselItem key={index}>
                <Image
                  src={item}
                  alt={product.name}
                  height={800}
                  width={800}
                  className={`object-cover transition-transform duration-300 ${showHover ? 'group-hover:scale-110' : 'group-hover:scale-100'}  h-[300px] rounded-t-md`}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

        </Carousel>

      </div>
      <div className='space-y-2 p-3 '>
        {/* Name */}
        <h3 className='text-xl font-semibold font-sans'>{product.name}</h3>
        {/* Desc */}
        <p className='text-sm font-thin text-gray-400 line-clamp-3'>{product.desc}</p>
        {/* Buttons */}
        <div className='pt-5 px-10 flex justify-center'>
          {/* <button
            className='bg-green-700 text-white px-5 py-2 rounded-md'
            onClick={() => console.log("enquire now")}>
            Enquire Now
          </button> */}
          <button
            className='bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md'
            onClick={() => addToCart({
              productId: product.id,
              productName: product.name,
              productDesc: product.desc,
              productImage: product.imagePaths[0],
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