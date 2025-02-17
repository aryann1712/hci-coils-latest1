"use client";


import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { CgSmile } from "react-icons/cg";


const OrderPage = () => {
    const { user } = useUser();
    const [mounted, setMounted] = useState(false);
    const [userOrders, setUserOrders] = useState([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }



    const getUserOrder = (() => {
        if (user) {
            // getting user previous orders
        }
    });

    return (
        <div className=" max-w-[75%] mx-auto py-10">
            <div className="mx-auto py-16 px-10 rounded-sm shadow-xl w-full space-y-10">
                <h1 className="text-blue-800 text-3xl font-semibold italic">Orders</h1>


                <div>
                    {
                        (userOrders.length === 0) ? (
                            <div className='flex flex-col items-center justify-center gap-10'>
                                <h3 className='text-gray-400 '>You don't have any previous order</h3>
                                <CgSmile className='text-8xl text-gray-400'/>
                                <Link href="/products">
                                    <div className="px-8 py-3 lg:w-[250px] rounded-md bg-red-400 hover:bg-red-500 text-center text-white font-semibold">Continue Shopping</div>
                                </Link>
                            </div>
                        ) : (
                            // add here the logic of order Card
                            <div></div>
                        )}
                </div>
            </div>
        </div>
    )
}

export default OrderPage