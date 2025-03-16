"use client";

import { useUser } from "@/context/UserContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, ChangeEvent } from "react";

type ImagePreview = {
  file: File;
  previewUrl: string;
};

export const predefinedCategories = [
  "Open Type Old Model",
  "Custom coils",
  "Open Type Rg Model",
  "Open Type Rgs Model"
];

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
    } else if (!(user.role === "admin" || user.role === "manager")) {
      router.replace("/");
      return;
    }
  }, [user, router]);

  // Handle file selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    const newPreviews: ImagePreview[] = selectedFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    // append new files to existing images
    setImages((prev) => [...prev, ...newPreviews]);
  };

  // Remove an image by index
  const removeImage = (index: number) => {
    setImages((prev) => {
      const newArr = [...prev];
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

    setLoading(true);


    if (!sku || !name || !description || !price || !images.length) {
      alert("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Example: create form data to send to backend
    // If you want to handle images, you might need an API route that handles multipart/form-data
    const formData = new FormData();
    formData.append("sku", sku);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());

    // categories as JSON or repeated key
    // formData.append("categories", categories.join(","));
    // formData.append("categories", categories);

    categories.forEach((item) => {
      formData.append("categories", item);
    });

    images.forEach((img) => {
      formData.append("image", img.file);
    });

    // Send to your backend route, e.g. /api/admin/products
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products`, {
        method: "POST",
        body: formData,
      });
      console.log("res", res);
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to create product");
        setLoading(false);
        return;
      }
      // success
      alert("Product added successfully!");
      setLoading(false);
      router.push("/admin-products"); // or wherever you list products
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Something went wrong");
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-[75%] mx-auto py-10 mb-10">
      <div className="mx-auto py-16 px-10 rounded-sm shadow-xl w-full space-y-10">
        <h1 className="text-blue-800 text-3xl font-semibold italic">Add Product</h1>

        <form className="border p-4 rounded-sm border-dashed space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block font-medium mb-1">Name</label>
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
            <label className="block font-medium mb-1">Description</label>
            <textarea
              className="border px-3 py-2 rounded-sm w-full"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block font-medium mb-1">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            {/* Preview + reorder */}
            <div className="mt-3 flex gap-4 flex-wrap">
              {images.map((img, index) => (
                <div key={index} className="border p-2 relative">
                  <Image
                    src={img.previewUrl}
                    alt={`preview-${index}`}
                    height={1000}
                    width={1000}
                    className="w-32 h-32 object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 text-white bg-red-500 rounded-full px-2"
                    onClick={() => removeImage(index)}
                  >
                    X
                  </button>
                  {/* Move up/down buttons */}
                  <div className="flex gap-1 mt-2 justify-center">
                    <button
                      type="button"
                      onClick={() => moveImage(index, "up")}
                      className="bg-blue-500 text-white px-2 rounded-sm"
                    >
                      {`<`}
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, "down")}
                      className="bg-blue-500 text-white px-2 rounded-sm"
                    >
                      {`>`}
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
              <label className="block font-medium mb-1">Price</label>
              <input
                type="number"
                className="border px-3 py-2 rounded-sm w-full"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0"
                min={0}
                step={1}
              />
            </div>

            {/* GST */}
            <div className="w-1/2">
              <label className="block font-medium mb-1">SKU</label>
              <input
                type="text"
                className="border px-3 py-2 rounded-sm w-full"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="SKU"
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
