"use client";
import { UserAllInfoType } from '@/lib/interfaces/UserInterface'
import React from 'react'

const AdminUserDetailsCard = ({ userAllInfoTypes }: { userAllInfoTypes: UserAllInfoType[] }) => {
    const handleRoleChange = (userId: string, newRole: string) => {
        if (window.confirm("Are you sure?")) {
            // Call API to update role
            console.log(`Updating user ${userId} to role ${newRole}`);
            // API call logic goes here
        }
    };

    return (
        <div className='shadow-md rounded-md my-5 py-5 px-5 border-dashed border flex flex-col'>
            <div className='grid grid-cols-4 my-5 text-2xl font-semibold text-gray-500 font-serif'>
                <h2>Name</h2>
                <h2>Email</h2>
                <h2>Phone</h2>
                <h2>Role</h2>
            </div>
            {userAllInfoTypes.map((data, index) => (
                <div key={index} className='grid grid-cols-4 my-2 text-lg font-semibold text-black font-serif'>
                    <h2>{data.name}</h2>
                    <h2>{data.email}</h2>
                    <h2>{data.phone}</h2>
                    {data.role === "admin" ? (
                        <h2>{data.role}</h2>
                    ) : (
                        <select
                            value={data.role}
                            onChange={(e) => handleRoleChange(data.userId, e.target.value)}
                            className='border p-1 rounded'
                        >
                            <option value="user">User</option>
                            <option value="manager">Manager</option>
                        </select>
                    )}
                </div>
            ))}
        </div>
    )
}

export default AdminUserDetailsCard
