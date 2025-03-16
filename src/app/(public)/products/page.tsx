"use client";

import ProductCard from "@/components/ProductCard";
import { ProductAllTypeInterfact } from "@/data/allProducts";
import { useEffect, useMemo, useState } from "react";



export default function ProductsPage() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductAllTypeInterfact[]>([]);
  const [openTypeOldModel, setOpenTypeOldModel] = useState<ProductAllTypeInterfact[]>([]);
  const [customCoils, setCustomCoils] = useState<ProductAllTypeInterfact[]>([]);
  const [openTypeRGModel, setOpenTypeRGModel] = useState<ProductAllTypeInterfact[]>([]);
  const [openTypeRGSModel, setOpenTypeRGSModel] = useState<ProductAllTypeInterfact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Fetch data (simulate API call)
  useEffect(() => {
    async function fetchData() {
      const data = await getAllProductsFromAPI();
      const data2 = await getOpenTypeOldModelFromAPI();
      const data3 = await customCoilsFromAPI();
      const data4 = await getOpenTypeRGModelFromAPI();
      const data5 = await getOpenTypeRGSModelFromAPI();
      setProducts(data);
      setOpenTypeOldModel(data2);
      setCustomCoils(data3);
      setOpenTypeRGModel(data4);
      setOpenTypeRGSModel(data5);
    }
    fetchData();
  }, []);



  // Filter the products by category AND search query
  const filteredProducts = useMemo(() => {
    let filtered = products;
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

  // Example placeholder fetch
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
        alert(data.error || "Sign in failed");
        return [];
      }

      return data.data;
    } catch (error) {
      setLoading(false);
      console.error(error);
      return [];
    }
  }

  async function getOpenTypeOldModelFromAPI(): Promise<ProductAllTypeInterfact[]> {
    try {
      setLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/categories?categories=Open Type Old Model`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      setLoading(false);

      if (!response.ok) {
        alert(data.error || "Sign in failed");
        return [];
      }

      return data.data;
    } catch (error) {
      setLoading(false);
      console.error(error);
      return [];
    }
  }


  async function customCoilsFromAPI(): Promise<ProductAllTypeInterfact[]> {
    try {
      setLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/categories?categories=Custom coils`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      setLoading(false);

      if (!response.ok) {
        alert(data.error || "Sign in failed");
        return [];
      }

      return data.data;
    } catch (error) {
      setLoading(false);
      console.error(error);
      return [];
    }
  }

  async function getOpenTypeRGModelFromAPI(): Promise<ProductAllTypeInterfact[]> {
    try {
      setLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/categories?categories=Open Type Rg Model`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      setLoading(false);

      if (!response.ok) {
        alert(data.error || "Sign in failed");
        return [];
      }

      return data.data;
    } catch (error) {
      setLoading(false);
      console.error(error);
      return [];
    }
  }


  async function getOpenTypeRGSModelFromAPI(): Promise<ProductAllTypeInterfact[]> {
    try {
      setLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/categories?categories=Open Type Rgs Model`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      setLoading(false);

      if (!response.ok) {
        alert(data.error || "Sign in failed");
        return [];
      }

      return data.data;
    } catch (error) {
      setLoading(false);
      console.error(error);
      return [];
    }
  }


  return (
    <section className="p-4 lg:px-16 mb-10 min-h-[60vh]">
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


      {/* Loading State */}
      {loading && (
        <div className="grid grid-col-1 gap-8 gap-y-10 md:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-md bg-primary/10 h-96" />
          ))}
        </div>
      )}


      {openTypeOldModel.length > 0 && <div className="mb-20">
        <h2 className=" mb-4 text-xl font-bold text-gray-600">Open Type Old Model</h2>
        <div className=" flex flex-row overflow-x-scroll gap-x-20">
          {openTypeOldModel.map((product) => (
            <div className="w-40 lg:w-96 rounded-md shadow-lg flex flex-col items-start justify-center gap-5 ">
              <ProductCard key={product._id} product={product} />
            </div>
          ))}
        </div>
      </div>
      }

      {customCoils.length > 0 && <div className="mb-20">
        <h2 className=" mb-4 text-xl font-bold text-gray-600">Custom Coils</h2>
        <div className=" flex flex-row overflow-x-scroll gap-x-20">
          {customCoils.map((product) => (
            <div className="w-40 lg:w-96 rounded-md shadow-lg flex flex-col items-start justify-center gap-5 ">
              <ProductCard key={product._id} product={product} />
            </div>
          ))}
        </div>
      </div>
      }

      {openTypeRGModel.length > 0 && <div className="mb-20">
        <h2 className=" mb-4 text-xl font-bold text-gray-600">Open Type RG Model</h2>
        <div className=" flex flex-row overflow-x-scroll gap-x-20">
          {openTypeRGModel.map((product) => (
            <div className="w-40 lg:w-96 rounded-md shadow-lg flex flex-col items-start justify-center gap-5 ">
              <ProductCard key={product._id} product={product} />
            </div>
          ))}
        </div>
      </div>
      }

      {openTypeRGSModel.length > 0 && <div className="mb-20">
        <h2 className=" mb-4 text-xl font-bold text-gray-600">Open Type RGS Model</h2>
        <div className=" flex flex-row overflow-x-scroll gap-x-20">
          {openTypeRGSModel.map((product) => (
            <div className="w-40 lg:w-96 rounded-md shadow-lg flex flex-col items-start justify-center gap-5 ">
              <ProductCard key={product._id} product={product} />
            </div>
          ))}
        </div>
      </div>
      }




      <h2 className=" mb-4 text-xl font-bold text-gray-600">All Products</h2>
      <div className=" flex flex-row overflow-x-scroll gap-x-20">
          {filteredProducts.map((product) => (
            <div className="w-40 lg:w-96 rounded-md shadow-lg flex flex-col items-start justify-center gap-5 ">
              <ProductCard key={product._id} product={product} />
            </div>
          ))}
        </div>


      {/* Product Grid */}
      {/* <div className="grid grid-cols-2  gap-8 gap-y-10 md:grid-cols-3">
        {currentPageProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div> */}

      {/* Pagination Controls */}
      {/* {totalPages > 1 && (
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
      )} */}
    </section>
  );
}

