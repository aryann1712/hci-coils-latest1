"use client";

import { useUser } from "@/context/UserContext";
import { useParams, useRouter } from "next/navigation";
import React, {  useEffect, useState } from "react";




export default function EditProductPage() {
  const [mounted, setMounted] = useState(false);

  const [loading, setLoading] = useState(false);
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);



  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  const { user } = useUser();
  const router = useRouter();

  // If using the folder structure: (admin)/admin-products/edit-product/[productId]
  // you can read productId via useParams
  const params = useParams();
  const productIds = params?.productId; // string | string[]

  const productId = Array.isArray(productIds) ? productIds[0] : productIds;
  // Now singleProductId is guaranteed to be a string


  // Alternatively, if you had "?id=123" in the query, you'd do:
  // const searchParams = useSearchParams();
  // const productId = searchParams.get("productId");


  // 1) On mount, check user and load product data
  useEffect(() => {
    setMounted(true);

    if (!user) {
      router.replace("/");
      return;
    } else if (!(user.role === "admin" || user.role === "manager")) {
      router.replace("/");
      return;
    }

    if (productId) {
      fetchProduct(productId);
    }
  }, [user, router, productId]);

  // 2) fetch existing product data
  async function fetchProduct(id: string) {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`, {
        method: "GET",
      });
      if (!res.ok) {
        setLoading(false);
        // e.g. redirect or show error
        throw new Error("Failed to fetch product");
      }
      const response = await res.json();
      const data = response.data;

      setLoading(false);
      // Fill form states
      setName(data.name || "");
      setDescription(data.description || "");
      setPrice(data.price || 0);
      setCategories(data.category.split(",") || []);

    } catch (error) {
      setLoading(false);
      console.error("Error loading product:", error);
      // possibly redirect or show error message
    }
  }



  // handle categories
  const addCategory = () => {
    if (categoryInput.trim() && !categories.includes(categoryInput.trim())) {
      setCategories((prev) => [...prev, categoryInput.trim()]);
    }
    setCategoryInput("");
  };
  const removeCategory = (cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
  };

  // 3) handle form submission
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;


    setLoading(true);


    if (!name || !description || !price || !categories.length) {
      alert("Please fill in all fields");
      setLoading(false);
      return;
    }

    // construct form data (multipart) or JSON
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("category", categories.join(","));



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



          {/* Categories */}
          <div>
            <label className="block font-medium mb-1">Categories (tags)</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="border px-3 py-2 rounded-sm w-full"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                placeholder="Type a category and click add"
              />
              <button
                type="button"
                onClick={() => addCategory()}
                className="bg-blue-700 text-white px-4 py-2 rounded-sm"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className="bg-gray-200 px-2 py-1 rounded-lg flex items-center gap-2"
                >
                  <span>{cat}</span>
                  <button
                    type="button"
                    onClick={() => removeCategory(cat)}
                    className="text-red-600 font-bold"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Price & GST */}
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
                step={0.01}
              />
            </div>
          </div>

          <button
          disabled={loading}
            type="submit"
            className="bg-blue-700 text-white px-6 py-2 rounded-md font-semibold mt-4"
          >
            {loading ? "Loading" : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
