"use client";

import { useCart } from '@/context/CartContext';
import { ProductAllTypeInterfact } from '@/data/allProducts';
import Image from 'next/image';

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';


const ProductCard = ({ product, showHover = true }: { product: ProductAllTypeInterfact, showHover?: boolean }) => {
  const { addToCart } = useCart();
  const router = useRouter();

  console.log("productCard", product)

  return (
    <div className='w-40 lg:w-96 rounded-md shadow-lg flex flex-col items-start justify-center gap-5 '>
      <ToastContainer />
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
            onClick={() => {

              toast.success('Product Added Successfully!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });


              return addToCart({
                _id: product._id,
                name: product.name,
                description: product.description,
                images: product.images,
                category: product.category || '',
                sku: product.sku,
                quantity: 1
              });
            }}>
            Add to Cart
          </button>
        </div>
      </div>

    </div>
  );
}



export default ProductCard