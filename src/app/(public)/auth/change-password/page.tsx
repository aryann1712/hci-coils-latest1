"use client";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);

    if (!user) {
      router.replace("/");
      return;
    }
  }, [user]);


  // Form validation
  const validateForm = () => {
    if (!formData.currentPassword) {
      setError("Current password is required");
      return false;
    }
    if (!formData.newPassword) {
      setError("New password is required");
      return false;
    }
    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return false;
    }
    return true;
  };

  const handleChangePassword = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/cp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user?.userId,
          email: user?.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to change password");
        setLoading(false);
        return;
      }

      setSuccess("Password changed successfully");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      console.error("Error changing password:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-5 lg:px-0 lg:max-w-[75%] mx-auto py-10">
      <h1 className="text-blue-800 text-3xl font-semibold italic">Change Password</h1>
      <div className="mx-auto py-16 px-4 lg:px-10 rounded-sm shadow-xl max-w-2xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="flex flex-col gap-y-6 px-2 lg:px-10">
          <div className="flex flex-col gap-y-2">
            <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              id="currentPassword"
              className="border px-3 py-3 rounded-sm"
              type="password"
              placeholder="Enter your current password"
              value={formData.currentPassword}
              onChange={(e) => setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="newPassword"
              className="border px-3 py-3 rounded-sm"
              type="password"
              placeholder="Enter your new password"
              value={formData.newPassword}
              onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              className="border px-3 py-3 rounded-sm"
              type="password"
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-800 text-white px-4 py-2 rounded-lg mt-4"
            disabled={loading}
          >
            {loading ? "Changing password..." : "Change Password"}
          </button>
        </form>

        <div className="mt-10">
          <Link href="/">
            <div className="text-blue-800 cursor-pointer">Back to Home</div>
          </Link>
        </div>
      </div>
    </div>
  );
}