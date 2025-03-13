"use client";
import { EmployyeeAllInfoType } from '@/lib/interfaces/UserInterface';
import { useEffect, useState } from 'react';

const AdminCustomerCard = ({ userAllInfoTypes, currentUserId }: { userAllInfoTypes: EmployyeeAllInfoType[], currentUserId: string }) => {
  // Create local state to manage users data
  const [users, setUsers] = useState<EmployyeeAllInfoType[]>([]);

  // Initialize local state when props change
  useEffect(() => {
    setUsers(userAllInfoTypes);
  }, [userAllInfoTypes]);

  const handleStatusChange = async (userId: string, newRole: string) => {
    console.log(`Updating user ${userId} to status ${newRole}`);
    if (window.confirm("Are you sure?")) {
      // Call API to update role if currentUserId exists
      if (currentUserId) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/customers/status`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "adminId": currentUserId,
              "updateId": userId,
              "status": newRole
            })
          });

          const data = await res.json();

          if (!res.ok) {
            alert(data.error || "Error in updating employees");
            return;
          }

          // Update local state to reflect the change
          setUsers(prevUsers =>
            prevUsers.map(user =>
              user._id === userId ? { ...user, role: newRole } : user
            )
          );

        } catch (error) {
          alert(error || "Error in updating employees");
          return;
        }
      }
    }
  };

  return (
    <div className='shadow-md rounded-md gap-x-5 my-5 py-5 px-5 border-dashed border flex flex-col'>
        <div className='grid grid-cols-2 md:grid-cols-4 my-5 text-base md:text-2xl font-semibold text-gray-500 font-serif'>
          <h2>Name</h2>
          <h2>Email</h2>
          <h2>Phone</h2>
          <h2>Status</h2>
        </div>

        {users.map((data, index) => (
          <div key={index} className='grid grid-cols-2 md:grid-cols-4 mt-10 md:mt-0 my-2 text-xs md:text-base font-semibold text-black font-serif'>
            <h2>{data.name}</h2>
            <h2>{data.email}</h2>
            <h2>{data.phone}</h2>
            {data.role === "admin" ? (
              <h2>{data.status}</h2>
            ) : (
              <select
                value={data.role}
                onChange={(e) => handleStatusChange(data._id, e.target.value)}
                className='border p-1 rounded'
              >
                <option value="true">Active</option>
                <option value="false">Not Active</option>
              </select>
            )}
          </div>
        ))}
    </div>
  );
};

export default AdminCustomerCard;