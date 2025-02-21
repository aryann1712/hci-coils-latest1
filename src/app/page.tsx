// src/app/dashboard/page.tsx
import DashboardAboutUs from "@/components/dashboardComponents/DashboardAboutUs";
import DashboardProductCarousel from "@/components/dashboardComponents/DashboardProductCarousel";
import DashboardProductRange from "@/components/dashboardComponents/DashboardProductRange";
import DashboardVideo from "@/components/dashboardComponents/DashboardVideo";
import DashboardWhyChooseUs from "@/components/dashboardComponents/DashboardWhyChooseUs";

export default async function DashboardPage() {

  // Welcome, {session?.user?.name}
  return (
    <section className="">
      <DashboardVideo />
      <DashboardAboutUs />
      <DashboardWhyChooseUs />
      <DashboardProductRange />
      <DashboardProductCarousel />
      {/* <h1 className="text-2xl font-bold">Welcome to Our E-commerce</h1> */}
      {/* Highlight featured products, banners, etc. */}
    </section>
  );
}
