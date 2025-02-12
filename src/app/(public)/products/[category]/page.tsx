// src/app/(public)/products/[category]/page.tsx
interface Props {
    params: { category: string };
  }
  
  export default async function CategoryPage({ params }: Props) {
    const { category } = params;
    const products = await getProductsByCategory(category);
  
    return (
      <section className="p-4">
        <h2 className="text-xl font-semibold">Category: {category}</h2>
        {/* Render filtered products */}
      </section>
    );
  }
  
  async function getProductsByCategory(category: string) {
    // Example logic for fetching products by category
    const res = await fetch(`https://api.example.com/products?category=${category}`);
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    return data;
  }