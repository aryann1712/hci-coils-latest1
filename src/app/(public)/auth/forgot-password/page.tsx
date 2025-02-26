"use client";


import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "" });



    const router = useRouter();

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Example: Real sign-in (uncomment to use real API)
        // const response = await fetch("/api/users/signin", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     phone: formData.phone,
        //     password: formData.password,
        //   }),
        // });
        // const data = await response.json();
        // if (!response.ok) {
        //   alert(data.error || "Sign in failed");
        //   setLoading(false);
        //   return;
        // }

        // For demonstration: mock data
        const data = {
            userId: "1",
            phone: "9315045029",
            role: "admin",
            token: "abcd", // pretend JWT
            name: "Rounak",
        };


        // Redirect
        router.push("/");
        setLoading(false);
    };

    return (
        <div className="max-w-[75%] mx-auto py-10">
            <h1 className="text-blue-800 text-3xl font-semibold italic">Forgot Password</h1>

            <div className="mx-auto pt-16 pb-5 px-10 rounded-sm shadow-xl max-w-2xl">
                <form onSubmit={handleForgotPassword} className="flex flex-col gap-y-12 px-10">
                    <input
                        className="border px-3 py-3 rounded-sm"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, email: e.target.value }))
                        }
                    />



                    <button
                        type="submit"
                        className="bg-blue-800 text-white px-4 py-2 rounded-lg"
                        disabled={loading}
                    >
                        {"Forgot Password"}
                    </button>
                </form>

                <div className="mt-10 space-y-10">

                    <Link href="/auth/signin">
                        <h4>
                            <span className="text-blue-800 cursor-pointer">Sign In</span>
                        </h4>
                    </Link>
                </div>
            </div>
        </div>
    );
}
