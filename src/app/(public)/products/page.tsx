"use client";
// src/app/(public)/products/page.tsx
import ProductCard from "@/components/ProductCard";

export default async function ProductsPage() {
  // Example: server-side fetch (using an in-house or external API).
  const products = await getProductsFromAPI();

  return (
    <section className="p-4">
      <h2 className="text-xl font-semibold">Our Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

// Example placeholder fetch function
async function getProductsFromAPI() {
  // ...fetch from DB or external service
  return [
    { id: 1, name: "Product A", image: "", description: "...", quantity: 1 },
    { id: 2, name: "Product B", image: "", description: "...", quantity: 1 },
    // ...
  ];
}
