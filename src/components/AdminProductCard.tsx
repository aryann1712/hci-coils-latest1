"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdDelete, MdEdit } from "react-icons/md";
import { ProductAllTypeInterfact } from "@/data/allProducts";

const AdminProductCard = ({ product }: { product: ProductAllTypeInterfact }) => {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => {
    // Navigate to your edit page
    router.push(`/admin-products/edit-product/${product._id}`);
  };

  const handleDeleteClick = () => {
    // Show modal
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    try {
      // Example API call: DELETE /api/admin/products/[id]
    //   const res = await fetch(`/api/admin/products/${product.id}`, {
    //     method: "DELETE",
    //   });
    //   if (!res.ok) {
    //     const error = await res.json();
    //     alert(error.message || "Failed to delete product");
    //     return;
    //   }
      // Possibly refetch products or remove from list in parent
      alert("Product deleted successfully.");
      setShowDeleteConfirm(false);
      router.refresh();
    //   window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Error deleting product");
    }
  };

  return (
    <div className="grid grid-cols-4 items-center py-5 border-b relative">
      {/* Image */}
      <div>
        <Image
          src={product.images[0] || "/logo.png"}
          alt={product.name}
          width={1000}
          height={1000}
          className="h-[200px] w-[350px] rounded-md object-cover"
        />
      </div>

      {/* Name and Description */}
      <div className="col-span-2 flex flex-col px-4">
        <h1 className="text-lg font-semibold">{product.name}</h1>
        <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-8 items-center justify-center">
        <MdEdit
          className="text-3xl mb-1 text-gray-500 hover:text-black cursor-pointer"
          onClick={handleEdit}
        />
        <MdDelete
          className="text-3xl mb-1 text-gray-500 hover:text-black cursor-pointer"
          onClick={handleDeleteClick}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-md shadow-md w-[300px]">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="text-sm mb-6">Are you sure you want to delete this product?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductCard;
