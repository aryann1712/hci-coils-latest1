"use client";

import ProductCard from "@/components/ProductCard";
import { ProductAllTypeInterfact } from "@/data/allProducts";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

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

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
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
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load products. Please try again later.');
      }
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
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
      const apiUrl = `${baseUrl}/api/products`;
      console.log('Fetching all products from:', apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: 'include',
        mode: 'cors'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          url: apiUrl
        });
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      setLoading(false);
      return data.data || [];
    } catch (error) {
      setLoading(false);
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products. Please try again later.');
      return [];
    }
  }

  async function getCategoryProductsFromAPI(category: string): Promise<ProductAllTypeInterfact[]> {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
      const apiUrl = `${baseUrl}/api/products/categories?categories=${encodeURIComponent(category)}`;
      console.log('Fetching category products from:', apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: 'include',
        mode: 'cors'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          url: apiUrl
        });
        throw new Error(`Failed to fetch category products: ${response.statusText}`);
      }

      const data = await response.json();
      setLoading(false);
      return data.data || [];
    } catch (error) {
      setLoading(false);
      console.error('Error fetching category products:', error);
      toast.error('Failed to fetch category products. Please try again later.');
      return [];
    }
  }

  // Render product category section
  const renderCategorySection = (category: string, products: ProductAllTypeInterfact[]) => {
    if (products.length === 0) return null;
    
    return (
      <div key={category} className="mb-20">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">{category}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="container mx-auto px-4 py-8 min-h-[60vh]">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="max-w-md mx-auto">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name, description, or SKU..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={`loading-${i}`} className="animate-pulse rounded-lg bg-gray-200 h-96" />
          ))}
        </div>
      )}

      {/* Category Sections */}
      {!loading && Object.entries(filteredCategoryProducts).map(([category, products]) => 
        renderCategorySection(category, products)
      )}

      {/* All Products Section */}
      {!loading && filteredAllProducts.length > 0 && renderCategorySection("All Products", filteredAllProducts)}
    </section>
  );
}