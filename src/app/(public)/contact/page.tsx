// src/app/(public)/contact/page.tsx
"use client"; // If you need client-side handling
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // handle POST to your API route: /api/contact
    console.log(formData);
    if (formData.name || formData.phone || formData.message) {
      alert(`name: ${formData.name}, phone: ${formData.phone}, message: ${formData.message}`);
    } else {
      alert('Please fill all fields.');
    }
  };

  return (
    <section className="py-4 max-w-[75%] mx-auto">
      <div className="flex items-start justify-center gap-5 py-10">

        <div className="w-1/2 space-y-10">
          <h2 className="text-4xl text-blue-700 font-semibold">Contact Us</h2>
          <h3 className="text-2xl text-gray-400">We are the world class services and solutions to our customers. </h3>

          {/* Address */}
          <div>
            <h3 className="text-base text-black font-normal">Head Office</h3>
            <h3 className="text-lg text-blue-800 font-extrabold">335, sector-5, vasundhara, Ghaziabad, Uttar Pradesh, 201012</h3>
          </div>

          {/* Phone Number */}
          <div>
            <h3 className="text-base text-black font-normal">Phone</h3>
            <h3 className="text-lg text-blue-800 font-extrabold">931-504-5029</h3>
          </div>

          {/* Email */}
          <div>
            <h3 className="text-base text-black font-normal">Email</h3>
            <h3 className="text-lg text-blue-800 font-extrabold">rounakraj0309@gmail.com</h3>
          </div>

        </div>


        <div className="w-1/2 bg-white p-6 shadow-md rounded-sm">

          <form onSubmit={onSubmit} className="flex flex-col gap-8">
            <input
              className="border px-3 py-3 rounded-sm"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <input
              className="border px-3 py-3 rounded-sm"
              type="tel"
              placeholder="Phone No"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
            <textarea
              className="border px-3 py-3 rounded-sm min-h-36"
              placeholder=" Description / Requirement"
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
            />
            <button type="submit" className="bg-blue-800 text-white px-4 py-2">
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
