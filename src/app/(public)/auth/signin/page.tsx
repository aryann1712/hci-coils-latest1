// src/app/(public)/auth/signin/page.tsx
"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ phone: "", password: "" });


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // signIn("credentials" or "provider", { ...options });
    // or call a custom route for sign in
    setLoading(false);
  };

  return (
    <div className=" max-w-[75%] mx-auto py-10">
      <h1 className="text-blue-800 text-3xl font-semibold italic">Sign In</h1>
      <div className="mx-auto py-16 px-10 rounded-sm shadow-xl max-w-2xl">
        <form onSubmit={handleSignIn} className="flex flex-col gap-y-12 px-10">
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

        <div className="mt-10 space-y-5">
          <h4 className="text-sm font-semibold text-blue-800 cursor-pointer">forgot password?</h4>
          <div></div>
          <Link href="/auth/signup"><h4>Not a user? <span className="text-blue-800 cursor-pointer">Sign Up</span></h4></Link>
        </div>

      </div>

    </div>
  );
}
