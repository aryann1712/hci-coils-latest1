"use client";
// src/app/(protected)/profile/page.tsx
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default async function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, []);



  return (
    <div className=" max-w-[75%] mx-auto py-10">
      <div className="mx-auto py-16 px-10 rounded-sm shadow-xl w-full space-y-10">
        <h1 className="text-blue-800 text-3xl font-semibold italic">Profile</h1>
        <div>

        </div>
      </div>
    </div>
  );
}
