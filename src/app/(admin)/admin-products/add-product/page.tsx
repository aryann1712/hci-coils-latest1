"use client";

import { useUser } from "@/context/UserContext";
import { predefinedCategories } from "@/data/allProducts";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, ChangeEvent } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ImagePreview = {
  file: File;
  previewUrl: string;
};

export default function AdminAddProduct() {
  const { user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [loading, setLoading] = useState(false);
  // Form state
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  // Track total upload size
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

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.replace("/");
      return;
    } else if (!(user.role === "admin" || user.role === "manager" || user.role === "product_adder")) {
      router.replace("/");
      return;
    }
  }, [user, router]);

  // Handle file selection with size limit
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    
    // Calculate size of new files
    const newFilesSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    
    // Check if adding these new files would exceed the limit
    if (totalSize + newFilesSize > MAX_TOTAL_SIZE) {
      toast.error(`Total image size cannot exceed 7MB. Current: ${(totalSize/1024/1024).toFixed(2)}MB, Trying to add: ${(newFilesSize/1024/1024).toFixed(2)}MB`);
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const invalidFiles = selectedFiles.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    const newPreviews: ImagePreview[] = selectedFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    // append new files to existing images and update total size
    setImages((prev) => [...prev, ...newPreviews]);
    setTotalSize(prevSize => prevSize + newFilesSize);
  };

  // Remove an image by index
  const removeImage = (index: number) => {
    setImages((prev) => {
      const newArr = [...prev];
      // Update total size by subtracting the removed file's size
      setTotalSize(prevSize => prevSize - newArr[index].file.size);
      newArr.splice(index, 1);
      return newArr;
    });
  };

  // Reorder images (move up or down)
  const moveImage = (index: number, direction: "up" | "down") => {
    setImages((prev) => {
      const newArr = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      // boundary checks
      if (targetIndex < 0 || targetIndex >= newArr.length) return newArr;
      // swap
      const temp = newArr[index];
      newArr[index] = newArr[targetIndex];
      newArr[targetIndex] = temp;
      return newArr;
    });
  };

  // Add category
  const addCategory = () => {
    if (categoryInput.trim() && !categories.includes(categoryInput.trim())) {
      setCategories((prev) => [...prev, categoryInput.trim()]);
    }
    setCategoryInput("");
  };

  // Remove category
  const removeCategory = (cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!name || !description || !price) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate categories
    if (categories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    // Validate images
    if (images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price.toString());
      
      // Append all categories
      categories.forEach((category, index) => {
        formData.append(`categories[${index}]`, category);
      });

      if (sku) formData.append("sku", sku);
      
      // Append each image file
      images.forEach((image, index) => {
        formData.append(`images`, image.file);
      });

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
      
      const response = await fetch(`${baseUrl}/products`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success("Product created successfully!");
        router.push("/admin-products");
      } else {
        throw new Error(data.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(image => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, [images]);

  if (!mounted) return null;

  return (
    <div className="w-full px-2 md:px-0 md:max-w-[75%] mx-auto py-10 mb-10">
      <div className="mx-auto py-16 px-2 md:px-10 rounded-sm shadow-xl w-full space-y-10">
        <h1 className="text-blue-800 text-2xl md:text-3xl font-semibold italic">Add New Product</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Images */}
          <div>
            <label className="block font-medium mb-1">Product Images</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageChange}
              className="border px-3 py-2 rounded-sm w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              Maximum total size: 7MB. Supported formats: JPEG, PNG, WebP
            </p>

            {images.length > 0 && (
              <div className="mt-4 border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preview
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        File Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {images.map((img, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative w-20 h-20">
                            <Image
                              src={img.previewUrl}
                              alt={`preview-${index}`}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 truncate max-w-xs">
                            {img.file.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {(img.file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => moveImage(index, "up")}
                              className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={index === 0}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => moveImage(index, "down")}
                              className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={index === images.length - 1}
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="w-full max-w-md">
            <label className="block font-medium mb-1">Categories (tags)</label>
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
                step={1}
                required
              />
            </div>

            {/* Part Code */}
            <div className="w-1/2">
              <label className="block font-medium mb-1">Part Code <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="border px-3 py-2 rounded-sm w-full"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Part Code"
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="bg-blue-700 text-white px-6 py-2 rounded-md font-semibold mt-4"
          >
            {loading ? "Submitting" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}