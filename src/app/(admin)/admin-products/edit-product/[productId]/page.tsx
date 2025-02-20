"use client";

import { useUser } from "@/context/UserContext";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";

type ExistingImage = {
  url: string;            // existing image URL from the database
  _id?: string;           // ID if you track images separately
};

type NewImagePreview = {
  file: File;
  previewUrl: string;
};

export default function EditProductPage() {
  const [mounted, setMounted] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [gst, setGst] = useState<number>(18);

  // We separate "existingImages" from "newImages"
  // existingImages = images from the DB
  // newImages = local, newly selected files to upload
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [newImages, setNewImages] = useState<NewImagePreview[]>([]);

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
      // const res = await fetch(`/api/admin/products/${id}`, {
      //   method: "GET",
      //   // or any auth headers if needed
      // });
      // if (!res.ok) {
      //   // e.g. redirect or show error
      //   throw new Error("Failed to fetch product");
      // }
      // const data = await res.json();
      console.log(id);

      const data = {
        name: "Rounak Raj",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta totam fugit voluptas facere voluptates ab tenetur molestias atque mollitia eum nostrum, minima in, modi possimus! Ad praesentium assumenda minima soluta?",
        price: 300,
        gst: 24,
        categories: ["smart", "genius", "coder"],
        images: [
          { url: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
          { url: "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
          { url: "https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" }
        ]
      }

      // Fill form states
      setName(data.name || "");
      setDescription(data.description || "");
      setPrice(data.price || 0);
      setGst(data.gst || 18);
      setCategories(data.categories || []);
      setExistingImages(data.images || []);
      // data.images might be an array like [{ url: "...", _id: "..." }, ...]

    } catch (error) {
      console.error("Error loading product:", error);
      // possibly redirect or show error message
    }
  }

  // Handle new file selection
  const handleNewImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    const newPreviews: NewImagePreview[] = selectedFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [...prev, ...newPreviews]);
  };

  // Remove an existing image
  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => {
      const newArr = [...prev];
      newArr.splice(index, 1);
      return newArr;
    });
  };

  // Reorder existing images
  const moveExistingImage = (index: number, direction: "up" | "down") => {
    setExistingImages((prev) => {
      const newArr = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newArr.length) return newArr;
      const temp = newArr[index];
      newArr[index] = newArr[targetIndex];
      newArr[targetIndex] = temp;
      return newArr;
    });
  };

  // Remove newly selected image
  const removeNewImage = (index: number) => {
    setNewImages((prev) => {
      const newArr = [...prev];
      newArr.splice(index, 1);
      return newArr;
    });
  };

  // Reorder newly selected images
  const moveNewImage = (index: number, direction: "up" | "down") => {
    setNewImages((prev) => {
      const newArr = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newArr.length) return newArr;
      const temp = newArr[index];
      newArr[index] = newArr[targetIndex];
      newArr[targetIndex] = temp;
      return newArr;
    });
  };

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

    // construct form data (multipart) or JSON
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("gst", gst.toString());
    formData.append("categories", JSON.stringify(categories));

    // existing images: pass their order + any flagged for removal
    // For example, you might pass them as JSON
    formData.append(
      "existingImages",
      JSON.stringify(existingImages.map((img) => ({ url: img.url, _id: img._id })))
    );

    // new images
    newImages.forEach((img) => {
      formData.append("newImages", img.file);
    });

    try {
      // const res = await fetch(`/api/admin/products/${productId}`, {
      //   method: "PUT",
      //   body: formData,
      // });
      // if (!res.ok) {
      //   const errorData = await res.json();
      //   alert(errorData.error || "Update failed");
      //   return;
      // }
      alert("Product updated successfully!");
      router.push("/admin-products");
    } catch (error) {
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

          {/* Existing Images */}
          <div>
            <label className="block font-medium mb-1">
              Existing Images (from server)
            </label>
            <div className="mt-3 flex gap-4 flex-wrap">
              {existingImages.map((img, index) => (
                <div key={index} className="border p-2 relative">
                  <Image
                    height={1000}
                    width={1000}
                    src={img.url}
                    alt={`existing-${index}`}
                    className="w-32 h-32 object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 text-white bg-red-500 rounded-full px-2"
                    onClick={() => removeExistingImage(index)}
                  >
                    X
                  </button>
                  <div className="flex gap-1 mt-2 justify-center">
                    <button
                      type="button"
                      onClick={() => moveExistingImage(index, "up")}
                      className="bg-blue-500 text-white px-2 rounded-sm"
                    >
                      {`<`}
                    </button>
                    <button
                      type="button"
                      onClick={() => moveExistingImage(index, "down")}
                      className="bg-blue-500 text-white px-2 rounded-sm"
                    >
                      {`>`}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Images */}
          <div>
            <label className="block font-medium mb-1">
              Add New Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleNewImageChange}
            />
            <div className="mt-3 flex gap-4 flex-wrap">
              {newImages.map((img, index) => (
                <div key={index} className="border p-2 relative">
                  <Image
                   height={1000}
                   width={1000}
                    src={img.previewUrl}
                    alt={`new-${index}`}
                    className="w-32 h-32 object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 text-white bg-red-500 rounded-full px-2"
                    onClick={() => removeNewImage(index)}
                  >
                    X
                  </button>
                  <div className="flex gap-1 mt-2 justify-center">
                    <button
                      type="button"
                      onClick={() => moveNewImage(index, "up")}
                      className="bg-blue-500 text-white px-2 rounded-sm"
                    >
                      {`<`}
                    </button>
                    <button
                      type="button"
                      onClick={() => moveNewImage(index, "down")}
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
            <div className="w-1/2">
              <label className="block font-medium mb-1">GST (%)</label>
              <input
                type="number"
                className="border px-3 py-2 rounded-sm w-full"
                value={gst}
                onChange={(e) => setGst(Number(e.target.value))}
                placeholder="18"
                min={0}
                step={0.01}
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-700 text-white px-6 py-2 rounded-md font-semibold mt-4"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}
