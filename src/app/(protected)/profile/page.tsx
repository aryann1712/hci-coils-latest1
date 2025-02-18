"use client";
// src/app/(protected)/profile/page.tsx
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



const ProfilePage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);

    if (!user) {
      router.replace("/");
      return;
    }
    console.log("username => ", user)
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className=" max-w-[75%] mx-auto py-10">
      <div className="mx-auto py-16 px-10 rounded-sm shadow-xl w-full space-y-10">
        <h1 className="text-blue-800 text-3xl font-semibold italic">Profile</h1>
        <div>
          <div>
            <h3>Name:</h3>
            <input value={user?.name || ""} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage