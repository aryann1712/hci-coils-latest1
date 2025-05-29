// src/context/UserContext.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { UserType } from "@/lib/interfaces/UserInterface";
import { useRouter } from "next/navigation";

interface UserContextType {
  user: UserType | null;
  signIn: (userData: UserType, token: string) => void;
  signOut: () => void;
  updateUser: (updatedUser: Partial<UserType>) => void;
  getToken: () => string | null;
}

const UserContext = createContext<UserContextType>({
  user: null,
  signIn: () => {},
  signOut: () => {},
  updateUser: () => {},
  getToken: () => null,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  // State for user
  const [user, setUser] = useState<UserType | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  // Whenever user changes, store it in localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user]);

  // signIn can be called after you verify credentials with your backend
  const signIn = (userData: UserType, token: string) => {
    setUser(userData);
    // Store token with Bearer prefix
    localStorage.setItem("token", `Bearer ${token}`);
  };

  // signOut clears user state and token
  const signOut = async () => {
    try {
      // Get the current cart from localStorage
      const cartItems = localStorage.getItem("cartItems");
      if (cartItems && user?.userId) {
        // Save cart to server before logout
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            userId: user.userId,
            cartItems: JSON.parse(cartItems)
          }),
        });

        if (!response.ok) {
          console.error("Failed to save cart before logout");
        }
      }
    } catch (error) {
      console.error("Error saving cart before logout:", error);
    } finally {
      // Clear user state and token regardless of cart save success
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("cartItems"); // Clear local cart
      router.replace("/auth/signin");
    }
  };

  // updateUser merges fields with the existing user data
  const updateUser = (updatedUser: Partial<UserType>) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, ...updatedUser };
    });
  };

  // getToken returns the current authentication token
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  return (
    <UserContext.Provider value={{ user, signIn, signOut, updateUser, getToken }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
