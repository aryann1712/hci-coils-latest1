"use client";
// src/app/(protected)/profile/page.tsx
import { useUser } from "@/context/UserContext";
import { UserAllInfoType } from "@/lib/interfaces/UserInterface";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";



const ProfilePage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [userData, setUserData] = useState<UserAllInfoType | null>(null)

  const getUserInfoFromAPI = useCallback(async (): Promise<UserAllInfoType> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/profile/${user?.userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Sign in failed");
        return {
          userId: "",
          phone: "",
          name: "",
          address: "",
          companyName: "",
          email: "",
          gstNumber: ""
        };
      }
      return data.data;
    } catch (error) {
      console.error("Sign in failed:", error);
      return {
        userId: "",
        phone: "",
        name: "",
        address: "",
        companyName: "",
        email: "",
        gstNumber: ""
      };
    }
  }, [user?.userId]);


  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      const data = await getUserInfoFromAPI();
      setUserData(data);
    }

    if (!user) {
      router.replace("/");
      return;
    } else {
      fetchData();
    }
    console.log("username => ", user)
  }, [user, router, getUserInfoFromAPI]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full px-2 md:px-0 md:max-w-[75%] mx-auto py-10 mb-10">
      <div className="mx-auto py-16 px-10 rounded-sm shadow-xl w-full space-y-10">
        <h1 className="text-blue-800 text-3xl font-semibold italic">Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-10 text-xl text-gray-400 font-semibold text-end">
          <div className="flex justify-between">
            <h3>Name:</h3> <h3 className="max-w-lg">{user?.name || ""}</h3>
          </div>
          <div className="flex justify-between">
            <h3>Phone:</h3> <h3 className="max-w-lg">{user?.phone || ""}</h3>
          </div>
          <div className="flex justify-between">
            <h3>Email:</h3> <h3 className="max-w-lg">{userData?.email || ""}</h3>
          </div>
          <div className="flex justify-between">
            <h3>Address:</h3> <h3 className="max-w-lg">{userData?.address || ""}</h3>
          </div>
          <div className="flex justify-between">
            <h3>Company Name:</h3> <h3 className="max-w-lg">{userData?.companyName || ""}</h3>
          </div>
          <div className="flex justify-between">
            <h3>GST No:</h3> <h3 className="max-w-lg">{userData?.gstNumber || ""}</h3>
          </div>
        </div>
      </div>
    </div>

  );
}

export default ProfilePage