// src/app/(public)/auth/signup/page.tsx
"use client";
import { useState } from "react";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    gstNumber: "",
    address: "",
    phone: "",
    email: "",
    // ...
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // 1. Verify GST # (optional: via backend API).
    // 2. Verify phone with OTP (could be a separate step).
    // 3. Create user in database, auto-generate customer ID/password, send email.
  };

  return (
    <div className="p-4">
      <h1>Register Your Company</h1>
      <form onSubmit={handleSignUp} className="flex flex-col gap-4">
        {/* input fields for companyName, gstNumber, etc. */}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Register
        </button>
      </form>
    </div>
  );
}
