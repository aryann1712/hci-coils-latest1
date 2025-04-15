"use client";
import { EmployyeeAllInfoType } from '@/lib/interfaces/UserInterface';
import { useEffect, useState } from 'react';

const AdminUserDetailsCard = ({ userAllInfoTypes, currentUserId }: { userAllInfoTypes: EmployyeeAllInfoType[], currentUserId: string }) => {
  // Create local state to manage users data
  const [users, setUsers] = useState<EmployyeeAllInfoType[]>([]);

  // Initialize local state when props change
  useEffect(() => {
    setUsers(userAllInfoTypes);
  }, [userAllInfoTypes]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    console.log(`Updating user ${userId} to role ${newRole}`);
    if (window.confirm("Are you sure?")) {
      // Call API to update role if currentUserId exists
      if (currentUserId) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/employees/role`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "adminId": currentUserId,
              "updateId": userId,
              "role": newRole
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
    <div>

      <div className='hidden lg:flex shadow-md rounded-md gap-x-5 my-5 py-5 px-5 border-dashed border  flex-col'>
        <div className='grid grid-cols-2 lg:grid-cols-5 my-5 text-base md:text-2xl font-semibold text-gray-500 font-serif'>
          <h2>Name</h2>
          <h2>Email</h2>
          <h2></h2>
          <h2>Phone</h2>
          <h2>Role</h2>
        </div>

        {users.map((data, index) => (
          <div key={index} className='grid grid-cols-2 lg:grid-cols-5 mt-10 md:mt-0 my-2 text-xs md:text-base font-semibold text-black font-serif'>
            <h2>{data.name}</h2>
            <h2>{data.email}</h2>
            <h2>{ }</h2>
            <h2 >{data.phone}</h2>
            {data.role === "admin" ? (
              <h2>{data.role}</h2>
            ) : (
              <select
                value={data.role}
                onChange={(e) => handleRoleChange(data._id, e.target.value)}
                className='border p-1 rounded'
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="product_adder">Product Adder</option>
              </select>
            )}
          </div>
        ))}
      </div>




      <div className='flex  lg:hidden shadow-md rounded-md gap-x-5 my-5 py-5 px-5 border-dashed border  flex-col'>
        <div className='grid grid-cols-2 lg:grid-cols-5 my-5 text-base md:text-2xl font-semibold text-gray-500 font-serif'>
          <h2>Name</h2>
          <h2>Email</h2>
          <h2>Phone</h2>
          <h2>Role</h2>
        </div>

        {users.map((data, index) => (
          <div key={index} className='grid grid-cols-2 lg:grid-cols-5 mt-10 md:mt-0 my-2 text-xs md:text-base font-semibold text-black font-serif'>
            <h2>{data.name}</h2>
            <h2>{data.email}</h2>
            <h2>{data.phone}</h2>
            {data.role === "admin" ? (
              <h2>{data.role}</h2>
            ) : (
              <select
                value={data.role}
                onChange={(e) => handleRoleChange(data._id, e.target.value)}
                className='border p-1 rounded'
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="product_adder">Product Adder</option>
              </select>
            )}
          </div>
        ))}
      </div>
    </div>

  );
};

export default AdminUserDetailsCard;