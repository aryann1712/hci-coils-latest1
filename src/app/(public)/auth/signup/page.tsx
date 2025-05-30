"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [gstVerifying, setGstVerifying] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    gstNumber: "",
    address: "",
    phone: "",
    email: ""
  });

  const [errors, setErrors] = useState({
    phone: "",
    email: ""
  });

  const [gstStatus, setGstStatus] = useState("Active");

  // Function to validate email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to validate phone number
  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  // Function to fetch GST information
  const fetchGstInfo = async (gstNumber: string) => {
    if (!gstNumber || gstNumber.length !== 15) return;

    console.log("Verifying GST:", gstNumber); // Debug log
    setGstVerifying(true);
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/getGSTinfo/${gstNumber}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      console.log("GST API Response:", data); // Debug log
      setLoading(false);
      setGstVerifying(false);

      if (!response.ok) {
        setGstVerifying(false);
        console.error("GST verification failed:", data.error);
        alert(data.error || "GST verification failed");
        setGstStatus("GST verification failed");
        return;
      }

      // If successful, auto-fill form fields with the GST data
      if (data.success && data.data) {
        setFormData(prev => ({
          ...prev,
          name: data.data.name || prev.name,
          companyName: data.data.tradeNam || prev.companyName,
          address: data.data.address || prev.address
        }));

        if (data.data.sts) {
          setGstStatus(data.data.sts);
        }
      }
    } catch (error) {
      setLoading(false);
      setGstVerifying(false);
      alert("An error occurred while verifying GST. Please try again.");
      console.error("GST verification error:", error);
    } finally {
      setLoading(false);
      setGstVerifying(false);
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { phone: "", email: "" };

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    // Validate phone
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
      valid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    if (gstStatus != "Active") {
      alert("Sign Up failed. GST is either not active or verified properly.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          gstNumber: formData.gstNumber,
          companyName: formData.companyName,
          address: formData.address
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        alert(data.error || "Sign up failed");
        return;
      }

      router.push("/auth/signin");
    } catch (error) {
      setLoading(false);
      console.error("Signup error:", error);
      alert("An error occurred during sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (name === "email" || name === "phone") {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    // Check for GST number length and trigger verification
    if (name === "gstNumber" && value.length === 15) {
      console.log("GST number reached 15 chars, triggering verification");
      fetchGstInfo(value);
    }
  };

  return (
    <div className="w-full px-5 lg:px-0 lg:max-w-[75%] mx-auto py-10">
      <h1 className="text-blue-800 text-3xl font-semibold italic">Sign Up</h1>
      <div className="mx-auto py-16 px-0 lg:px-10 rounded-sm shadow-xl max-w-2xl">
        <form onSubmit={handleSignUp} className="flex flex-col gap-y-12 px-4 lg:px-10">
          <div className="relative">
            <div className="flex gap-2">
              <input
                className="border px-3 py-3 rounded-sm flex-grow"
                type="text"
                name="gstNumber"
                placeholder="GST Number"
                value={formData.gstNumber}
                onChange={handleInputChange}
              />
            </div>
            {gstVerifying && (
              <div className="absolute right-20 top-3">
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            )}
            {formData.gstNumber && formData.gstNumber.length !== 15 && formData.gstNumber.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">GST Number must be 15 characters</p>
            )}
          </div>
          <input
            className="border px-3 py-3 rounded-sm"
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <div className="space-y-1">
            <input
              className={`border px-3 py-3 rounded-sm w-full ${errors.phone ? "border-red-500" : ""}`}
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone}</p>
            )}
          </div>
          <div className="space-y-1">
            <input
              className={`border px-3 py-3 rounded-sm w-full ${errors.email ? "border-red-500" : ""}`}
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>
          <input
            className="border px-3 py-3 rounded-sm"
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleInputChange}
          />
          <input
            className="border px-3 py-3 rounded-sm"
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
          />

          <button
            type="submit"
            className="bg-blue-800 text-white px-4 py-2 rounded-lg"
            disabled={loading || gstVerifying}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-10 space-y-5">
          <div></div>
          <Link href="/auth/signin">
            <h4>Already a user? <span className="text-blue-800 cursor-pointer">Sign In</span></h4>
          </Link>
        </div>
      </div>
    </div>
  );
}