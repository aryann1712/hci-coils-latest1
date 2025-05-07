"use client";

import { useUser } from "@/context/UserContext";
import { predefinedCategories } from "@/data/allProducts";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";

// Helper function to format image URLs
const formatImageUrl = (imageUrl: string) => {
  if (!imageUrl) 
    return '';

  return imageUrl;
  
  // If it's already a full URL, return it as is
  if (imageUrl.startsWith('http')) return imageUrl;
  
  // Otherwise, prepend the S3 base URL
  const s3BaseUrl = process.env.NEXT_PUBLIC_S3_URL || '';
  return `${s3BaseUrl}${imageUrl}`;
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
      fetchProduct(productId);
    }
  }, [user, router, productId]);

  // Fetch existing product data
  async function fetchProduct(id: string) {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`, {
        method: "GET",
      });
      if (!res.ok) {
        setLoading(false);
        throw new Error("Failed to fetch product");
      }
      const response = await res.json();
      const data = response.data;

      setLoading(false);
      // Fill form states
      setName(data.name || "");
      setDescription(data.description || "");
      setPrice(data.price || 0);
      setSku(data.sku || "");
      setCategories(data.categories || []);
      setImages(data.images || []);

    } catch (error) {
      setLoading(false);
      console.error("Error loading product:", error);
    }
  }

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

    // Validation
    if (!name || !description || !price) {
      alert("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (categories.length === 0) {
      alert("At least one category is required");
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${productId}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) {
        setLoading(false);
        const errorData = await res.json();
        alert(errorData.error || "Update failed");
        return;
      }
      alert("Product updated successfully!");
      setLoading(false);
      router.push("/admin-products");
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert("Something went wrong updating product");
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
              {images.map((img, index) => (
                <div key={index} className="relative w-24 h-24 border rounded">
                  <Image 
                    src={formatImageUrl(img)}
                    alt={`Product image ${index}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              {images.length === 0 && (
                <p className="text-gray-500">No images available</p>
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