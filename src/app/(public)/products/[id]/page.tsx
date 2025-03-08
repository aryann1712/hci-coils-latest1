"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ProductAllTypeInterfact } from "@/data/allProducts";
import { useCart } from '@/context/CartContext';


const ProductPage = () => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState<ProductAllTypeInterfact | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const params = useParams();

    useEffect(() => {
        async function fetchData() {
            const data = await getProductFromAPI();
            setProducts(data);
            // Set the first image as the selected image when data is fetched
            if (data?.images && data.images.length > 0) {
                setSelectedImage(data.images[0]);
            }
        }
        fetchData();
    }, [getProductFromAPI]);

    async function getProductFromAPI() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${params.id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Sign in failed");
            return null;
        }
        return data.data;
    }

    const handleImageSelect = (image: string) => {
        setSelectedImage(image);
    };

    return (
        <div className="max-w-[75%] mx-auto py-10">
            <div className="mx-auto py-16 px-10 rounded-sm shadow-xl">
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col">
                        {/* Main Image with Next.js Image */}
                        {selectedImage && (
                            <div className="relative h-[400px] w-full">
                                <Image
                                    src={selectedImage}
                                    alt={products?.name || "Product Image"}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}

                        {/* List of images */}
                        <div className="flex gap-x-6 mt-5">
                            {products?.images.map((image, index) => (
                                <div
                                    key={index}
                                    className="relative h-[100px] w-[100px]"
                                    onClick={() => handleImageSelect(image)}
                                >
                                    <Image
                                        src={image}
                                        alt={`${products?.name} - Image ${index + 1}`}
                                        fill
                                        className={`object-cover rounded-md hover:cursor-pointer border 
                      ${selectedImage === image ? 'border-red-500' : 'border-gray-400'}
                    `}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-5">
                        <h1 className="text-3xl font-semibold italic">{products?.name}</h1>
                        <p className="text-gray-400">{products?.description}</p>
                        <p className="text-gray-400">Category: {products?.category}</p>
                        <p className="text-gray-400">SKU: {products?.sku}</p>
                        <div></div>
                        <div></div>
                        <div></div>
                        <button
                            className="mt-32 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md "
                            // onClick={() => console.log("Add to cart")}
                            onClick={() => addToCart({
                                _id: products?._id!,
                                name: products?.name!,
                                description: products?.description!,
                                images: products?.images!,
                                category: products?.category || '',
                                sku: products?.sku!,
                                quantity: 1
                              })}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;