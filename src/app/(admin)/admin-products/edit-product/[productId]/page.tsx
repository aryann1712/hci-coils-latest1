"use client";

import { useUser } from "@/context/UserContext";
import { predefinedCategories } from "@/data/allProducts";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper function to format image URLs
const formatImageUrl = (imageUrl: string | undefined | null) => {
  if (!imageUrl) return '/placeholder-image.png';
  
  // If it's already a full URL, return it as is
  if (imageUrl.startsWith('http')) return imageUrl;
  
  // Otherwise, prepend the base URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
  return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};

export default function EditProductPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [sku, setSku] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const params = useParams();
  const productIds = params?.productId;
  const productId = Array.isArray(productIds) ? productIds[0] : productIds;

  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      setCategories(categories.filter(c => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // On mount, check user and load product data
  useEffect(() => {
    setMounted(true);

    if (!user) {
      router.replace("/");
      return;
    } else if (!(user.role === "admin" || user.role === "manager" || user.role === "product_adder")) {
      router.replace("/");
      return;
    }

    if (productId) {
      fetchProduct();
    }
  }, [user, router, productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
      console.log('Fetching product from:', `${baseUrl}/api/products/${productId}`);
      
      const res = await fetch(`${baseUrl}/api/products/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: 'include',
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', Object.fromEntries(res.headers.entries()));

      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error:', {
          status: res.status,
          statusText: res.statusText,
          body: errorText,
          url: `${baseUrl}/api/products/${productId}`
        });
        toast.error(`Failed to fetch product: ${res.statusText}`);
        setLoading(false);
        return;
      }

      const response = await res.json();
      console.log('Received data:', response);
      
      if (!response.data) {
        throw new Error("No product data received");
      }

      const data = response.data;
      setName(data.name || "");
      setDescription(data.description || "");
      setPrice(data.price || 0);
      setSku(data.sku || "");
      setCategories(data.categories || []);
      setImages(data.images || []);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to fetch product details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setImageFiles(selectedFiles);
      
      // Create preview URLs
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setImagePreview(newPreviews);
    }
  };

  // Remove selected image before upload
  const removeSelectedImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => {
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Remove existing image
  const removeExistingImage = (imageUrl: string) => {
    setImages(prev => prev.filter(img => img !== imageUrl));
  };

  // Handle categories
  const addCategory = () => {
    if (categoryInput.trim() && !categories.includes(categoryInput.trim())) {
      setCategories((prev) => [...prev, categoryInput.trim()]);
    }
    setCategoryInput("");
  };

  // Handle form submission
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    setLoading(true);

    // Validate required fields
    if (!name || !description || !price) {
      toast.error("Please fill in all required fields", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          background: "#ef4444",
          color: "white",
          fontSize: "14px",
          fontWeight: "500",
        },
      });
      setLoading(false);
      return;
    }

    // Validate categories
    if (categories.length === 0) {
      toast.error("Please select at least one category", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          background: "#ef4444",
          color: "white",
          fontSize: "14px",
          fontWeight: "500",
        },
      });
      setLoading(false);
      return;
    }

    // Construct form data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    if (sku) formData.append("sku", sku);
    
    // Append existing images
    formData.append("existingImages", JSON.stringify(images));
    
    // Append categories
    categories.forEach((item) => {
      formData.append("categories", item);
    });

    // Append new image files
    imageFiles.forEach((file) => {
      formData.append("image", file);
    });

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
      console.log('Updating product at:', `${baseUrl}/api/products/${productId}`);
      
      const res = await fetch(`${baseUrl}/api/products/${productId}`, {
        method: "PUT",
        credentials: 'include',
        body: formData,
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', Object.fromEntries(res.headers.entries()));

      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error:', {
          status: res.status,
          statusText: res.statusText,
          body: errorText,
          url: `${baseUrl}/api/products/${productId}`
        });
        toast.error(`Failed to update product: ${res.statusText}`);
        setLoading(false);
        return;
      }

      const response = await res.json();
      console.log('Update response:', response);

      // Show success toast with animation
      toast.success("Product updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          background: "#22c55e",
          color: "white",
          fontSize: "14px",
          fontWeight: "500",
          borderRadius: "8px",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        },
      });

      router.push("/admin-products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update product", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          background: "#ef4444",
          color: "white",
          fontSize: "14px",
          fontWeight: "500",
          borderRadius: "8px",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-[75%] mx-auto py-10 mb-10">
      <div className="mx-auto py-16 px-10 rounded-sm shadow-xl w-full space-y-10">
        <h1 className="text-blue-800 text-3xl font-semibold italic">
          Edit Product
        </h1>

        <form
          className="border p-4 rounded-sm border-dashed space-y-6"
          onSubmit={handleUpdate}
        >
          {/* Name */}
          <div>
            <label className="block font-medium mb-1">Name <span className="text-red-500">*</span></label>
            <input
              className="border px-3 py-2 rounded-sm w-full"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description <span className="text-red-500">*</span></label>
            <textarea
              className="border px-3 py-2 rounded-sm w-full"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              required
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block font-medium mb-1">Part Code</label>
            <input
              className="border px-3 py-2 rounded-sm w-full"
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Part Code"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block font-medium mb-1">Current Images</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {images.length > 0 ? (
                images.map((img, index) => (
                  <div key={index} className="relative w-24 h-24 border rounded">
                    <Image 
                      src={formatImageUrl(img)}
                      alt={`Product image ${index}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-image.png';
                        target.onerror = null;
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No images</span>
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="block font-medium mb-1">Add New Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="border px-3 py-2 rounded-sm w-full"
              />
            </div>

            {imagePreview.length > 0 && (
              <div className="mt-4">
                <p className="font-medium mb-1">New Image Previews</p>
                <div className="flex flex-wrap gap-4">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative w-24 h-24 border rounded">
                      <Image 
                        src={preview}
                        alt={`New image ${index}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeSelectedImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="w-full max-w-md">
            <label className="block font-medium mb-1">Categories (tags) <span className="text-red-500">*</span></label>
            <div className="relative">
              {/* Dropdown button */}
              <button
                type="button"
                onClick={toggleDropdown}
                className="w-full flex justify-between items-center border px-3 py-2 rounded-sm bg-white"
              >
                <span className="truncate">
                  {categories.length > 0
                    ? `${categories.length} selected`
                    : "Select categories"}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {/* Dropdown menu */}
              {isOpen && (
                <div className="absolute mt-1 w-full bg-white border rounded-sm shadow-lg z-10 max-h-60 overflow-y-auto">
                  {predefinedCategories.map((category) => (
                    <div
                      key={category}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => toggleCategory(category)}
                    >
                      <input
                        type="checkbox"
                        checked={categories.includes(category)}
                        onChange={() => { }}
                        className="mr-2"
                      />
                      <span>{category}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Display selected categories */}
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <div key={cat} className="bg-gray-200 px-2 py-1 rounded-lg flex items-center gap-2">
                  <span>{cat}</span>
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className="text-red-600 font-bold"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block font-medium mb-1">Price <span className="text-red-500">*</span></label>
              <input
                type="number"
                className="border px-3 py-2 rounded-sm w-full"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0"
                min={0}
                step={0.01}
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="bg-blue-700 text-white px-6 py-2 rounded-md font-semibold mt-4"
          >
            {loading ? "Loading..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
}