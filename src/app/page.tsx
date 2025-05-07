"use client";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// src/app/dashboard/page.tsx
import DashboardAboutUs from "@/components/dashboardComponents/DashboardAboutUs";
import DashboardProductCarousel from "@/components/dashboardComponents/DashboardProductCarousel";
import DashboardProductRange from "@/components/dashboardComponents/DashboardProductRange";
import DashboardVideo from "@/components/dashboardComponents/DashboardVideo";
import DashboardWhyChooseUs from "@/components/dashboardComponents/DashboardWhyChooseUs";

export default function DashboardPage() {


  const { user } = useUser();
  const router = useRouter();


  useEffect(() => {
    if (!user) {
      console.log("User is loading...");
      return; // Wait for user to load
    }
  
    console.log("User role:", user?.role);
    if (user?.role == "admin" || user?.role == "manager" || user?.role == "product_adder") {
      console.log("Redirecting to /admin-products");
      router.replace("/admin-products");
    }
  }, []);



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
