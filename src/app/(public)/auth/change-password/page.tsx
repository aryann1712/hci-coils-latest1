"use client";


import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ phone: "", password: "" });



  // const { signIn } = useUser();
  const router = useRouter();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Example: Real sign-in (uncomment to use real API)
    // const response = await fetch("/api/users/signin", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     phone: formData.phone,
    //     password: formData.password,
    //   }),
    // });
    // const data = await response.json();
    // if (!response.ok) {
    //   alert(data.error || "Sign in failed");
    //   setLoading(false);
    //   return;
    // }

    // For demonstration: mock data
    // const data = {
    //   userId: "1",
    //   phone: "9310741664",
    //   role: "admin",
    //   token: "abcd", // pretend JWT
    //   name: "Rounak",
    // };

    // Sign in with the user context
    // signIn({
    //   userId: data.userId,
    //   email: data.email,
    //   phone: data.phone,
    //   role: data.role,
    //   token: data.token,
    //   name: data.name,
    // });

    // Redirect
    router.push("/");
    setLoading(false);
  };

  return (
      <div className="max-w-[75%] mx-auto py-10">
        <h1 className="text-blue-800 text-3xl font-semibold italic">Change Password</h1>

        <div className="mx-auto py-16 px-10 rounded-sm shadow-xl max-w-2xl">
          <form onSubmit={handleChangePassword} className="flex flex-col gap-y-12 px-10">
            <input
              className="border px-3 py-3 rounded-sm"
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />

            <input
              className="border px-3 py-3 rounded-sm"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
            />

            <button
              type="submit"
              className="bg-blue-800 text-white px-4 py-2 rounded-lg"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-10 space-y-10">
            <h4 className="text-sm font-semibold text-blue-800 cursor-pointer mb-5">
              forgot password?
            </h4>

            <Link href="/auth/signup">
              <h4>
                Not a user?{" "}
                <span className="text-blue-800 cursor-pointer">Sign Up</span>
              </h4>
            </Link>
          </div>
        </div>
      </div>
  );
}
