// src/app/dashboard/page.tsx
import DashboardVideo from "@/components/DashboardVideo";
import { getSessionData } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getSessionData();

  // Welcome, {session?.user?.name}
  return (
    <section className="p-4">
      <DashboardVideo />
      <h1 className="text-2xl font-bold">Welcome to Our E-commerce</h1>
      {/* Highlight featured products, banners, etc. */}
    </section>
  );
}
