"use client";


import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });



  const { signIn } = useUser();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Debug log to check environment variable
    console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);
    console.log('Full URL:', `${process.env.NEXT_PUBLIC_BASE_URL}/users/signin`);

    // Temporary hardcoded base URL for testing
    const baseUrl = 'http://localhost:8080';
    console.log('Using hardcoded base URL:', baseUrl);

    // Example: Real sign-in (uncomment to use real API)
    const response = await fetch(`${baseUrl}/api/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });
    const data = await response.json();


    console.log("data", data);
    if (!response.ok) {
      alert(data.error || "Sign in failed");
      setLoading(false);
      return;
    }

  
    // Sign in with the user context
    signIn({
      userId: data.id,
      email: data.email,
      phone: data.phone,
      role: data.role,
      token: data.token,
      name: data.name,
    });

    // Redirect
    router.push("/");
    setLoading(false);
  };

  return (
      <div className="w-full px-5  lg:px-0 lg:max-w-[75%] mx-auto py-10">
        <div className="text-center mb-8">
          <h1 className="text-blue-800 text-4xl font-semibold italic">Sign In</h1>
        </div>

        <div className="mx-auto py-16 px-4 lg:px-10 rounded-sm shadow-xl max-w-2xl">
          <form onSubmit={handleSignIn} className="flex flex-col gap-y-12 px-2 lg:px-10">
            <input
              className="border px-3 py-3 rounded-sm"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
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
            {/* <h4 className="text-sm font-semibold text-blue-800 cursor-pointer mb-5">
              forgot password?
            </h4> */}

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
