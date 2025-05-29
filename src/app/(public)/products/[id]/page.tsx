"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ProductAllTypeInterfact } from "@/data/allProducts";
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const ProductPage = () => {
    const { addToCart } = useCart();
    const { user } = useUser();
    const router = useRouter();
    const [products, setProducts] = useState<ProductAllTypeInterfact | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const params = useParams();

    // Fetch product data when component mounts
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
    }, [params.id]); // Only depend on the product ID

    async function getProductFromAPI() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${params.id}`, {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
            });
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Failed to fetch product");
                return null;
            }
            return data.data;
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error("Failed to fetch product details");
            return null;
        }
    }

    const handleImageSelect = (image: string) => {
        setSelectedImage(image);
    };

    const handleAddToCart = () => {
        if (!user) {
            toast.error("Please log in to add items to cart", {
                icon: '🔒'
            });
            router.push("/auth/signin");
            return;
        }

        if (!products) return;

        addToCart({
            _id: products._id,
            name: products.name,
            description: products.description,
            images: products.images,
            category: products.category || '',
            sku: products.sku,
            quantity: 1,
            price: products.price || 0
        });
    };

    if (!products) {
        return (
            <div className="w-full max-w-6xl mx-auto py-5 px-4 sm:px-6 md:py-10">
                <div className="mx-auto py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-10 rounded-sm shadow-xl">
                    <div className="flex justify-center items-center h-[400px]">
                        <p className="text-gray-500">Loading product details...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto py-5 px-4 sm:px-6 md:py-10">
            <div className="mx-auto py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-10 rounded-sm shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* Product Images Section */}
                    <div className="flex flex-col">
                        {/* Main Image with Next.js Image */}
                        {selectedImage && (
                            <div className="relative h-[250px] sm:h-[300px] md:h-[400px] w-full">
                                <Image
                                    src={selectedImage}
                                    alt={products.name}
                                    fill
                                    className="object-cover rounded-md"
                                    priority
                                />
                            </div>
                        )}

                        {/* List of images */}
                        <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 mt-4 md:mt-5 justify-center sm:justify-start">
                            {products.images && products.images.map((image, index) => (
                                <div
                                    key={index}
                                    className="relative h-[70px] w-[70px] sm:h-[80px] sm:w-[80px] md:h-[100px] md:w-[100px]"
                                    onClick={() => handleImageSelect(image)}
                                >
                                    <Image
                                        src={image}
                                        alt={`${products.name} - Image ${index + 1}`}
                                        fill
                                        className={`object-cover rounded-md hover:cursor-pointer border-2
                                            ${selectedImage === image ? 'border-red-500' : 'border-gray-400'}
                                        `}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Details Section */}
                    <div className="space-y-1 md:space-y-5 mt-6 md:mt-0">
                        <h1 className="text-2xl md:text-3xl font-semibold italic">{products.name}</h1>
                        <h2 className="text-sm md:text-base font-semibold italic">Part Code {products.sku}</h2>
                        <p className="text-gray-400 pb-10 md:pb-30">{products.description}</p>
                        
                        <button
                            className="mt-6 sm:mt-16 md:mt-12 w-full md:w-auto bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md"
                            onClick={handleAddToCart}
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