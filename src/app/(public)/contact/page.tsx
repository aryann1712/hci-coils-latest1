// src/app/(public)/contact/page.tsx
"use client"; // If you need client-side handling
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // handle POST to your API route: /api/contact
  };

  return (
    <section className="p-4">
      <h2>Contact Us</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <textarea
          placeholder="Message"
          value={formData.message}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, message: e.target.value }))
          }
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Send
        </button>
      </form>
    </section>
  );
}
