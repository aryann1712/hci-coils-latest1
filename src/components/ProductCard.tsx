"use client";

import { useCart } from '@/context/CartContext';
import { ProductAllTypeInterfact } from '@/data/allProducts';
import { formatProductName } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";

const ProductCard = ({ product, showHover = true }: { product: ProductAllTypeInterfact, showHover?: boolean }) => {
  const { addToCart } = useCart();
  const router = useRouter();

  const cartAddMethod = () => {
    addToCart({
      _id: product._id,
      name: product.name,
      description: product.description,
      images: product.images,
      category: product.category || '',
      sku: product.sku,
      quantity: 1
    });
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden h-full ${showHover ? 'hover:shadow-xl transition-shadow duration-300' : ''}`}>
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative aspect-square">
          <Carousel>
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={index}>
                  <Image
                    src={image}
                    alt={formatProductName(product)}
                    width={1000}
                    height={1000}
                    className="w-full h-full object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </Link>

      <div className="p-6 flex flex-col justify-between h-[200px]">
        <div>
          <Link href={`/products/${product._id}`} className="block">
            <h3 className="text-xl font-semibold mb-3 line-clamp-1 hover:text-blue-600 transition-colors">
              {formatProductName(product)}
            </h3>
            <p className="text-gray-600 text-base mb-4 line-clamp-3">
              {product.description}
            </p>
          </Link>
        </div>
        <button
          onClick={cartAddMethod}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors text-lg font-medium"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;