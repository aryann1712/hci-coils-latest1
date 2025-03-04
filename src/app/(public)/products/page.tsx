"use client";

import ProductCard from "@/components/ProductCard";
import {  ProductAllTypeInterfact } from "@/data/allProducts";
import { useEffect, useMemo, useState } from "react";



export default function ProductsPage() {
  const [products, setProducts] = useState<ProductAllTypeInterfact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Fetch data (simulate API call)
  useEffect(() => {
    async function fetchData() {
      const data = await getProductsFromAPI();
      setProducts(data);
    }
    fetchData();
  }, []);

  // Distinct categories
  // const categories = useMemo(() => {
  //   const allCats = products.map((p) => p.category).filter(Boolean);
  //   return ["All", ...Array.from(new Set(allCats))];
  // }, [products]);

  // Filter the products by category AND search query
  const filteredProducts = useMemo(() => {
    // 1) Category filter
    let filtered = products;

    // 2) Search filter (case-insensitive match on product name OR description)
    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
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

  // Handlers
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

  return (
    <section className="p-4 px-16 mb-10">
      {/* Search Bar */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
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
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-8 gap-y-10 md:grid-cols-3">
        {currentPageProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
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
  );
}

// Example placeholder fetch
async function getProductsFromAPI(): Promise<ProductAllTypeInterfact[]> {


  // const data = AllProducts;

  // return data;


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
