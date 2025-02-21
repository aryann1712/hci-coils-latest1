"use client";

import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { AllProducts, ProductAllTypeInterfact } from '@/data/allProducts';
import ProductCard from '../ProductCard';
import Link from 'next/link';

const DashboardProductCarousel = () => {
  const [products, setProducts] = useState<ProductAllTypeInterfact[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSpeed = 15;

  useEffect(() => {
    async function fetchData() {
      const data = await getProductsFromAPI();
      setProducts(data);
    }
    fetchData();
  }, []);

  // Use useLayoutEffect to set initial scroll position
  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0); // Or containerRef.current.scrollLeft = 0;
      // console.log("Initial scrollLeft:", containerRef.current.scrollLeft); // Debugging
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    let animationId: number | null = null;

    const scroll = () => {
      if (containerRef.current) {
        containerRef.current.scrollLeft += scrollSpeed;

        // Check if scrolled to the end and reset
        if (containerRef.current.scrollLeft >= containerRef.current.scrollWidth - containerRef.current.offsetWidth) {
          containerRef.current.scrollLeft = 0;
          // console.log("Resetting scrollLeft:", containerRef.current.scrollLeft); // Debugging
        }
        // console.log("Current scrollLeft:", containerRef.current.scrollLeft); // Debugging
        animationId = requestAnimationFrame(scroll);
      }
    };

    if (products.length > 0 && containerRef.current) { // Check if containerRef is available
      scroll();
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [products]);

  return (
    <div className='pt-10 my-10 mx-auto flex flex-col justify-center items-center'>
      <h1 className='font-bold text-4xl w-full px-10'>Products</h1>
      <div
        ref={containerRef}
        className='w-full flex flex-row gap-x-10 py-10 justify-start items-center px-5 overflow-x-auto scroll-smooth no-scrollbar'
      >
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard key={product.id} product={product} />
          </div>
        ))}
      </div>
      <Link className='mt-10' href={'/products'}>
        <div className='px-8 py-3 max-w-44 rounded-md bg-blue-800 hover:bg-blue-700 text-white font-semibold'>
          Show More
        </div>
      </Link>
    </div>
  );
};

export default DashboardProductCarousel;

async function getProductsFromAPI(): Promise<ProductAllTypeInterfact[]> {
  const data = AllProducts;
  return data;
}