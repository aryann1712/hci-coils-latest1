"use client";
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const AdminAddProduct = () => {
    const { user } = useUser();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);



    useEffect(() => {
        setMounted(true);
        if (!user) {
            router.replace("/");
            return;
        } else if (!(user.role == "admin" || user.role == "manager")) {
            router.replace("/");
            return;
        } else { }
    }, []);


    return (
        <div>AdminAddProduct</div>
    )
}

export default AdminAddProduct;