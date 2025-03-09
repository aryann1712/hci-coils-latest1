"use client"
import AdminProductCard from "@/components/AdminProductCard";
// src/app/(admin)/products/page.tsx

import { useUser } from "@/context/UserContext";
import { ProductAllTypeInterfact } from "@/data/allProducts";
import Link from "next/link";
import { useRouter } from "next/navigation";



import React, { useEffect, useMemo, useState } from 'react'

const AdminProductsPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductAllTypeInterfact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;





  // Filter the products by category AND search query
  const filteredProducts = useMemo(() => {

    let filtered = products;
    // 1) Search filter (case-insensitive match on product name OR description)
    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered;
  }, [products, searchQuery]);


  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const currentPageProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };


  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };


  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      const data = await getProductsFromAPI();
      setProducts(data);
    }

    if (!user) {
      router.replace("/");
      return;
    } else {

      fetchData();
    }

  }, [user, router]);



  if (!mounted) {
    return null;
  }



  return (
    <section className="px-14 pt-10 pb-28">
      {/* Search Bar */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">

        <div className="w-full flex flex-row items-center justify-between gap-5">
          {/* Search Input */}
          <div>
            <label htmlFor="search" className="mr-2">
              Search:
            </label>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name or desc..."
              className="border p-1"
            />
          </div>
          {/* Add Product Grid */}
          <Link href={"/admin-products/add-product"}>
            <div className="bg-blue-800 hover:bg-blue-900 cursor-pointer px-5 py-2 text-white font-semibold rounded-md">Add New Product</div>
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-6">
        {currentPageProducts.map((product) => (
          <AdminProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 mt-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  )
}

export default AdminProductsPage



async function getProductsFromAPI(): Promise<ProductAllTypeInterfact[]> {

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();

  console.log("data", data);
  if (!response.ok) {
    alert(data.error || "Sign in failed");
    return [];
  }

 return data.data;
}