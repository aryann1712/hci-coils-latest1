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

    try {
      debugger; 
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
      console.log("Attempting to sign in with:", formData.email);
      
      const response = await fetch(`${baseUrl}api/users/signin`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      // Log the response status and headers
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      // Get the response text first
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
        alert("Server returned invalid response. Please try again later.");
        setLoading(false);
        return;
      }

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
    } catch (error) {
      console.error("Sign in error:", error);
      alert("Failed to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-5 lg:px-0 lg:max-w-[75%] mx-auto py-10">
      <h1 className="text-blue-800 text-3xl font-semibold italic">Sign In</h1>

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
