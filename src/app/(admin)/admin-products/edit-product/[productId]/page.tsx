"use client";

import { useUser } from "@/context/UserContext";
import { predefinedCategories } from "@/data/allProducts";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

type ImagePreview = {
  file: File;
  previewUrl: string;
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

  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: ''
  });
  const [totalSize, setTotalSize] = useState(0);
  const MAX_TOTAL_SIZE = 7 * 1024 * 1024; // 7MB in bytes

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
      // Set dimensions if they exist
      if (data.dimensions) {
        setDimensions({
          length: data.dimensions.length?.toString() || '',
          width: data.dimensions.width?.toString() || '',
          height: data.dimensions.height?.toString() || ''
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error loading product:", error);
    }
  }

  const handleDimensionChange = (field: 'length' | 'width' | 'height', value: string) => {
    setDimensions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image selection with size limit
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    
    // Calculate size of new files
    const newFilesSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    
    // Check if adding these new files would exceed the limit
    if (totalSize + newFilesSize > MAX_TOTAL_SIZE) {
      toast.error(`Total image size cannot exceed 7MB. Current: ${(totalSize/1024/1024).toFixed(2)}MB, Trying to add: ${(newFilesSize/1024/1024).toFixed(2)}MB`);
      return;
    }

    const newPreviews: ImagePreview[] = selectedFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImageFiles(selectedFiles);
    setImagePreview(newPreviews.map(p => p.previewUrl));
    setTotalSize(prevSize => prevSize + newFilesSize);
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
      toast.error("Please fill in all required fields", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setLoading(false);
      return;
    }

    if (categories.length === 0) {
      toast.error("At least one category is required", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
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
    
    // Add dimensions as individual fields
    if (dimensions.length || dimensions.width || dimensions.height) {
      formData.append("dimensions[length]", dimensions.length || "0");
      formData.append("dimensions[width]", dimensions.width || "0");
      formData.append("dimensions[height]", dimensions.height || "0");
    }
    
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
        toast.error(errorData.error || "Update failed", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
      toast.success("Product updated successfully! 🎉", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => router.push("/admin-products")
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Something went wrong updating product", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-[75%] mx-auto py-10 mb-10">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="mx-auto py-16 px-10 rounded-sm shadow-xl w-full space-y-10">
        <h1 className="text-blue-800 text-3xl font-semibold italic">
          Edit Product
        </h1>

        <form
          className="border p-4 rounded-sm border-dashed space-y-6"
          onSubmit={handleUpdate}
        >
          {/* Dimensions */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-1">Length </label>
              <input
                type="number"
                className="border px-3 py-2 rounded-sm w-full"
                value={dimensions.length}
                onChange={(e) => handleDimensionChange('length', e.target.value)}
                placeholder="Length"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Width </label>
              <input
                type="number"
                className="border px-3 py-2 rounded-sm w-full"
                value={dimensions.width}
                onChange={(e) => handleDimensionChange('width', e.target.value)}
                placeholder="Width"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Height </label>
              <input
                type="number"
                className="border px-3 py-2 rounded-sm w-full"
                value={dimensions.height}
                onChange={(e) => handleDimensionChange('height', e.target.value)}
                placeholder="Height"
                min="0"
                step="0.1"
              />
            </div>
          </div>

          {/* Name with dimensions prefix */}
          <div>
            <label className="block font-medium mb-1">Name <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-2">
              {dimensions.length || dimensions.width || dimensions.height ? (
                <span className="text-gray-500 whitespace-nowrap">
                  {[
                    dimensions.length ? `${dimensions.length}` : '',
                    dimensions.width ? `${dimensions.width}` : '',
                    dimensions.height ? `${dimensions.height}` : ''
                  ].filter(Boolean).join('/')}/
                </span>
              ) : null}
              <input
                className="border px-3 py-2 rounded-sm flex-1"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product name"
                required
              />
            </div>
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
            <label className="block font-medium mb-1">Images <span className="text-red-500">*</span></label>
            <div className="mb-2 flex justify-between items-center">
              <div className={`text-sm ${totalSize > MAX_TOTAL_SIZE ? "text-red-500" : "text-gray-500"}`}>
                Total size: {(totalSize / (1024 * 1024)).toFixed(2)}MB / 7MB
              </div>
              <div className="h-2 bg-gray-200 rounded-full w-40">
                <div 
                  className={`h-2 rounded-full ${totalSize > MAX_TOTAL_SIZE ? "bg-red-500" : "bg-green-500"}`}
                  style={{ width: `${Math.min(100, (totalSize / MAX_TOTAL_SIZE) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Current Images */}
            <div className="mt-3 flex gap-4 flex-wrap">
              {images.map((img, index) => (
                <div key={index} className="border p-2 relative">
                  <Image
                    src={formatImageUrl(img)}
                    alt={`existing-${index}`}
                    height={1000}
                    width={1000}
                    className="w-32 h-32 object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 text-white bg-red-500 rounded-full px-2"
                    onClick={() => removeExistingImage(img)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            {/* New Images Upload */}
            <div className="flex items-center gap-4 mt-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="product-images"
              />
              <label
                htmlFor="product-images"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Choose Files
              </label>
              <span className={`text-sm ${totalSize > MAX_TOTAL_SIZE ? "text-red-500" : "text-gray-500"}`}>
                Total size: {(totalSize / (1024 * 1024)).toFixed(2)}MB / 7MB
              </span>
            </div>

            {/* New Image Previews */}
            {imagePreview.length > 0 && (
              <div className="mt-3 flex gap-4 flex-wrap">
                {imagePreview.map((preview, index) => (
                  <div key={index} className="border p-2 relative">
                    <Image
                      src={preview}
                      alt={`preview-${index}`}
                      height={1000}
                      width={1000}
                      className="w-32 h-32 object-cover"
                    />
                    <span className="absolute bottom-10 left-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded">
                      {(imageFiles[index].size / 1024 / 1024).toFixed(2)}MB
                    </span>
                    <button
                      type="button"
                      className="absolute top-1 right-1 text-white bg-red-500 rounded-full px-2"
                      onClick={() => removeSelectedImage(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
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
            className="bg-blue-700 text-white px-6 py-2 rounded-md font-semibold mt-4 hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 w-full"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating Product...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Update Product
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}