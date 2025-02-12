// src/app/(protected)/profile/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(); 
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="p-4">
      <h2>Profile</h2>
      <p>Name: {session.user?.name}</p>
      <p>Company ID: {/* load from user object */}</p>
      <p>GST No: {/* from user object */}</p>
      {/* Render order/enquiry history */}
    </div>
  );
}
