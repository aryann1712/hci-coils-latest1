// src/components/ServerNavbar.tsx
import { getSessionData } from "@/lib/auth";
import Navbar from "./Navbar";

export default async function ServerNavbar() {
  const session = await getSessionData();

  return <Navbar user={session?.user} />;
}
