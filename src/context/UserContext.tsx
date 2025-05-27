// src/context/UserContext.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { UserType } from "@/lib/interfaces/UserInterface";
import { useRouter } from "next/navigation";

interface UserContextType {
  user: UserType | null;
  signIn: (userData: UserType) => void;
  signOut: () => void;
  updateUser: (updatedUser: Partial<UserType>) => void;
  mounted: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  signIn: () => {},
  signOut: () => {},
  updateUser: () => {},
  mounted: false,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  // Initialize user from localStorage after mount
  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Store user in localStorage when it changes
  useEffect(() => {
    if (mounted) {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }
  }, [user, mounted]);

  const signIn = (userData: UserType) => {
    setUser(userData);
  };

  const signOut = () => {
    setUser(null);
    router.replace("/auth/signin");
  };

  const updateUser = (updatedUser: Partial<UserType>) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, ...updatedUser };
    });
  };

  return (
    <UserContext.Provider value={{ user, signIn, signOut, updateUser, mounted }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
