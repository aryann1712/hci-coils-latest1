"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

type NavbarProps = {
  user?: {
    name?: string | null;  // Allow `null` to match NextAuth types
  };
};

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  return (
    <nav className="bg-white max-h-10 p-4 flex justify-between items-center">
      <Link href="/" className="text-black text-xl font-bold">
        Home
      </Link>
      <div>
        {user ? (
          <>
            <span className="text-black mr-4">
              {user.name ?? "User"} {/* Handle null by providing fallback */}
            </span>
            <button
              className="bg-red-500 text-black px-3 py-1 rounded"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/signin" className="text-black mr-4">
              Sign In
            </Link>
            <Link href="/auth/signup" className="text-black">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
