"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ProductAllTypeInterfact } from "@/data/allProducts";
import ProductCard from "../ProductCard";
import Link from "next/link";
import { Marquee } from "@/components/magicui/marquee";

const DashboardProductCarousel = () => {
  const [products, setProducts] = useState<ProductAllTypeInterfact[]>([]);

  const getProductsFromAPI = useCallback(async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch products");
    }
    return data.data;
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProductsFromAPI();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchData();
  }, [getProductsFromAPI]);

  // Ensure we only have products before splitting
  if (products.length === 0) return null;

  // Split products into two rows
  const firstRow = products.slice(0, Math.ceil(products.length / 2));
  const secondRow = products.slice(Math.ceil(products.length / 2));

  return (
    <div className="pt-10 my-10 mx-auto flex flex-col justify-center items-center">
      <h1 className="font-bold text-4xl w-full px-10">Products</h1>

      {/* Marquee Animation for Products */}
      <div className="relative flex w-full flex-col space-y-10 items-center justify-center overflow-hidden">
        {/* First Row - Moves Left */}
        <Marquee pauseOnHover={true} className="[--duration:300s]">
          {firstRow.map((product) => (
            <div key={product._id} className="lg:mx-10 w-48 lg:w-[350px]">
              <ProductCard product={product} showHover={false} />
            </div>
          ))}
        </Marquee>

        {/* Second Row - Moves Right */}
        <Marquee reverse pauseOnHover={true} className="[--duration:300s]">
          {secondRow.map((product) => (
            <div key={product._id} className="lg:mx-10 w-48 lg:w-[350px]">
              <ProductCard product={product} showHover={false} />
            </div>
          ))}
        </Marquee>
      </div>

      {/* Show More Button */}
      <Link className="mt-10" href={"/products"}>
        <div className="px-8 py-3 max-w-44 rounded-md bg-blue-800 hover:bg-blue-700 text-white font-semibold">
          Show More
        </div>
      </Link>
    </div>
  );
};

export default DashboardProductCarousel;
