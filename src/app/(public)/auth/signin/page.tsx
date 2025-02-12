// src/app/(public)/auth/signin/page.tsx
"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // signIn("credentials" or "provider", { ...options });
    // or call a custom route for sign in
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1>Sign In</h1>
      <form onSubmit={handleSignIn}>
        {/* Email, password fields */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
