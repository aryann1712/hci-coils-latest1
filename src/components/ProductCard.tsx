"use client";

import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { ProductAllTypeInterfact } from '@/data/allProducts';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product, showHover = true }: { product: ProductAllTypeInterfact, showHover?: boolean }) => {
  const { addToCart } = useCart();
  const { user } = useUser();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please log in to add items to cart", {
        icon: '🔒'
      });
      router.push("/auth/signin");
      return;
    }

    const itemWithPrice = {
      ...product,
      price: product.price || 0,
      quantity: 1,
      category: product.category || ''
    };
    addToCart(itemWithPrice);
  };

  return (
    <div className='w-40 lg:w-96 rounded-md shadow-lg flex flex-col items-start justify-center gap-5 '>
      {/* Image */}
      <div className="relative overflow-hidden group">
        <Carousel className="w-full">
          <CarouselContent>
            {product.images.map((item, index) => (
              <CarouselItem key={index}>
                <Image
                  key={index}
                  src={item}
                  alt={product.name}
                  height={800}
                  width={800}
                  onClick={() => router.push(`/products/${product._id}`)}
                  className={`object-cover transition-transform duration-300  ${showHover ? 'group-hover:scale-110' : 'group-hover:scale-100'} h-36 lg:h-[300px] rounded-t-md hover:cursor-pointer`}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className='space-y-2 px-2 pb-2 lg:p-3 '>
        {/* Name */}
        <h3 className='text-md md:text-xl font-semibold font-sans'>{product.name}</h3>
        {/* SKU */}
        <p className='text-xs md:text-xs text-gray-600 font-semibold font-sans'>Part Code - {product.sku}</p>
        {/* Desc */}
        <p className='text-xs md:text-sm font-thin text-gray-400 line-clamp-3'>{product.description}</p>
        {/* Buttons */}
        <div className='pt-5 px-2 md:px-10 flex justify-center'>
          {/* <button
            className='bg-green-700 text-white px-5 py-2 rounded-md'
            onClick={() => console.log("enquire now")}>
            Enquire Now
          </button> */}
          <button
            className='bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md'
            onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;