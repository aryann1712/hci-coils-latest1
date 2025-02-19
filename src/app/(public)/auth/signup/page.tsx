// src/app/(public)/auth/signup/page.tsx
"use client";
import Link from "next/link";
import { useState } from "react";


export default function SignUpPage() {
  const [formData, setFormData] = useState({
    userName: "",
    companyName: "",
    gstNumber: "",
    address: "",
    phone: "",
    password: "",
    email: ""
    // ...
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // 1. Verify GST # (optional: via backend API).
    // 2. Verify phone with OTP (could be a separate step).
    // 3. Create user in database, auto-generate customer ID/password, send email.
  };

  const [loading, setLoading] = useState(false);


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // signIn("credentials" or "provider", { ...options });
    // or call a custom route for sign in
    setLoading(false);
  };

  return (
    <div className=" max-w-[75%] mx-auto py-10">
      <h1 className="text-blue-800 text-3xl font-semibold italic">Sign Up</h1>
      <div className="mx-auto py-16 px-10 rounded-sm shadow-xl max-w-2xl">
        <form onSubmit={handleSignIn} className="flex flex-col gap-y-12 px-10">
          <input
            className="border px-3 py-3 rounded-sm"
            type="text"
            placeholder="Name"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
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
            type="email"
            placeholder="Email"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
          <input
            className="border px-3 py-3 rounded-sm"
            type="text"
            placeholder="Gst Number"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
          <input
            className="border px-3 py-3 rounded-sm"
            type="company Name"
            placeholder="Company Name"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
          <input
            className="border px-3 py-3 rounded-sm"
            type="text"
            placeholder="Address"
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
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-10 space-y-5">
          <div></div>
          <Link href="/auth/signin"><h4>Already a user? <span className="text-blue-800 cursor-pointer">Sign In</span></h4></Link>
        </div>

      </div>

    </div>
  );
}
