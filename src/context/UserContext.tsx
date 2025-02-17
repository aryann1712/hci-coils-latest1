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
}

const UserContext = createContext<UserContextType>({
  user: null,
  signIn: () => {},
  signOut: () => {},
  updateUser: () => {},
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
    }
  }, [user]);

  // signIn can be called after you verify credentials with your backend
  // e.g. if you get a JWT token, user info, etc.
  const signIn = (userData: UserType) => {
    setUser(userData);
  };

  // signOut clears user state
  const signOut = () => {
    setUser(null);
    router.replace("/auth/signin")
  };

  // updateUser merges fields with the existing user data
  const updateUser = (updatedUser: Partial<UserType>) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, ...updatedUser };
    });
  };

  return (
    <UserContext.Provider value={{ user, signIn, signOut, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
