"use client";

import ProductCard from "@/components/ProductCard";
import { AllProducts, ProductAllTypeInterfact } from "@/data/allProducts";
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
          p.desc.toLowerCase().includes(lowerQuery)
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


  const data = AllProducts;

  return data;


  // return [
  //   // A car image from stimg.cardekho.com
  //   {
  //     id: "1",
  //     name: "Product A1",
  //     image:
  //       "https://stimg.cardekho.com/images/carexteriorimages/930x620/Maruti/Dzire/11387/1731318279714/front-left-side-47.jpg",
  //     description: "Lorem ipsum dolor A1...",
  //     quantity: 1,
  //     category: "Cars",
  //   },

  //   // Cars (Unsplash)
  //   {
  //     id: "2",
  //     name: "Product A2",
  //     image:
  //       "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //     description: "Lorem ipsum dolor A2...",
  //     quantity: 1,
  //     category: "Cars",
  //   },
  //   {
  //     id: "3",
  //     name: "Product A3",
  //     image:
  //       "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //     description: "Lorem ipsum dolor A3...",
  //     quantity: 1,
  //     category: "Cars",
  //   },
  //   {
  //     id: "4",
  //     name: "Product A4",
  //     image:
  //       "https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //     description: "Lorem ipsum dolor A4...",
  //     quantity: 1,
  //     category: "Cars",
  //   },
  //   {
  //     id: "5",
  //     name: "Product A5",
  //     image:
  //       "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
  //     description: "Lorem ipsum dolor A5...",
  //     quantity: 1,
  //     category: "Cars",
  //   },

  //   // Trucks
  //   {
  //     id: "6",
  //     name: "Product T1",
  //     image:
  //       "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //     description: "Truck product T1...",
  //     quantity: 1,
  //     category: "Trucks",
  //   },
  //   {
  //     id: "7",
  //     name: "Product T2",
  //     image:
  //       "https://images.pexels.com/photos/248747/pexels-photo-248747.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //     description: "Truck product T2...",
  //     quantity: 1,
  //     category: "Trucks",
  //   },
  //   {
  //     id: "8",
  //     name: "Product T3",
  //     image:
  //       "https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //     description: "Truck product T3...",
  //     quantity: 1,
  //     category: "Trucks",
  //   },
  //   {
  //     id: "9",
  //     name: "Product T4",
  //     image:
  //       "https://images.pexels.com/photos/13861/IMG_3496bfree.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //     description: "Truck product T4...",
  //     quantity: 1,
  //     category: "Trucks",
  //   },
  //   {
  //     id: "10",
  //     name: "Product T5",
  //     image:
  //       "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //     description: "Truck product T5...",
  //     quantity: 1,
  //     category: "Trucks",
  //   },

  //   // Motorcycles
  //   {
  //     id: "11",
  //     name: "Product M1",
  //     image:
  //       "https://images.pexels.com/photos/909907/pexels-photo-909907.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //     description: "Motorcycle product M1...",
  //     quantity: 1,
  //     category: "Motorcycles",
  //   },
  //   {
  //     id: "12",
  //     name: "Product M2",
  //     image:
  //       "https://images.pexels.com/photos/70912/pexels-photo-70912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //     description: "Motorcycle product M2...",
  //     quantity: 1,
  //     category: "Motorcycles",
  //   },
  //   {
  //     id: "13",
  //     name: "Product M3",
  //     image:
  //       "https://images.pexels.com/photos/35967/mini-cooper-auto-model-vehicle.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //     description: "Motorcycle product M3...",
  //     quantity: 1,
  //     category: "Motorcycles",
  //   },
  //   {
  //     id: "14",
  //     name: "Product M4",
  //     image:
  //       "https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //     description: "Motorcycle product M4...",
  //     quantity: 1,
  //     category: "Motorcycles",
  //   },
  //   {
  //     id: "15",
  //     name: "Product M5",
  //     image:
  //       "https://images.pexels.com/photos/733745/pexels-photo-733745.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //     description: "Motorcycle product M5...",
  //     quantity: 1,
  //     category: "Motorcycles",
  //   },
  // ];
}
