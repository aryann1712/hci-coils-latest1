"use client";

import ProductCard from "@/components/ProductCard";
import { ProductAllTypeInterfact } from "@/data/allProducts";
import { useEffect, useMemo, useState } from "react";

export default function ProductsPage() {
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<ProductAllTypeInterfact[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<{
    [key: string]: ProductAllTypeInterfact[];
  }>({
    "Open Type Old Model": [],
    "Custom Coils": [],
    "Open Type Rg Model": [],
    "Open Type Rgs Model": [],
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data (simulate API call)
  useEffect(() => {
    async function fetchData() {
      // Fetch all products
      const allProductsData = await getAllProductsFromAPI();
      setAllProducts(allProductsData);
      
      // Fetch category-specific products
      const categories = [
        "Open Type Old Model",
        "Custom Coils",
        "Open Type Rg Model",
        "Open Type Rgs Model"
      ];
      
      const categoryData: { [key: string]: ProductAllTypeInterfact[] } = {};
      
      for (const category of categories) {
        const data = await getCategoryProductsFromAPI(category);
        categoryData[category] = data;
      }
      
      setCategoryProducts(categoryData);
    }
    
    fetchData();
  }, []);

  // Filter the products by search query across all categories
  const filteredAllProducts = useMemo(() => {
    if (searchQuery.trim() === "") return allProducts;
    
    const lowerQuery = searchQuery.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.sku.toLowerCase().includes(lowerQuery)
    );
  }, [allProducts, searchQuery]);

  // Filter each category by search query
  const filteredCategoryProducts = useMemo(() => {
    if (searchQuery.trim() === "") return categoryProducts;
    
    const lowerQuery = searchQuery.toLowerCase();
    const filtered: { [key: string]: ProductAllTypeInterfact[] } = {};
    
    for (const [category, products] of Object.entries(categoryProducts)) {
      filtered[category] = products.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.sku.toLowerCase().includes(lowerQuery)
      );
    }
    
    return filtered;
  }, [categoryProducts, searchQuery]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // API Calls
  async function getAllProductsFromAPI(): Promise<ProductAllTypeInterfact[]> {
    try {
      setLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      setLoading(false);

      if (!response.ok) {
        alert(data.error || "Failed to fetch products");
        return [];
      }

      return data.data;
    } catch (error) {
      setLoading(false);
      console.error(error);
      return [];
    }
  }

  async function getCategoryProductsFromAPI(category: string): Promise<ProductAllTypeInterfact[]> {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/products/categories?categories=${encodeURIComponent(category)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      setLoading(false);

      if (!response.ok) {
        alert(data.error || "Failed to fetch category products");
        return [];
      }

      return data.data;
    } catch (error) {
      setLoading(false);
      console.error(error);
      return [];
    }
  }

  // Render product category section
  const renderCategorySection = (category: string, products: ProductAllTypeInterfact[]) => {
    if (products.length === 0) return null;
    
    return (
      <div className="mb-20">
        <h2 className="mb-4 text-xl font-bold text-gray-600">{category}</h2>
        <div className="flex flex-row overflow-x-scroll gap-x-20">
          {products.map((product) => (
            <div key={product._id} className="w-40 lg:w-96 rounded-md shadow-lg flex flex-col items-start justify-center gap-5">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="p-4 lg:px-16 mb-10 min-h-[60vh]">
      {/* Search Bar */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
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

      {/* Loading State */}
      {loading && (
        <div className="grid grid-col-1 gap-8 gap-y-10 md:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-md bg-primary/10 h-96" />
          ))}
        </div>
      )}

      {/* Category Sections */}
      {Object.entries(filteredCategoryProducts).map(([category, products]) => 
        renderCategorySection(category, products)
      )}

      {/* All Products Section */}
      {renderCategorySection("All Products", filteredAllProducts)}
    </section>
  );
}