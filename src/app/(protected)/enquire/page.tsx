"use client";


import OrderItemCard from '@/components/OrderItemCard';
import { useUser } from '@/context/UserContext';
import { OrderItemType } from '@/lib/interfaces/OrderInterface';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CgSmile } from "react-icons/cg";


const EnquirePage = () => {
    const { user } = useUser();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [userOrders, setUserOrders] = useState<OrderItemType[]>([]);

    useEffect(() => {
        setMounted(true);
        async function fetchData() {
            const data = await getUserOrder();
            setUserOrders(data);
        }

        if (!user) {
            router.replace("/");
            return;
        } else {
            fetchData();
        }

    }, [user, router, getUserOrder]);

    if (!mounted) {
        return null;
    }



    async function getUserOrder(): Promise<OrderItemType[]> {
        if(user) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/enquire/userid/${user.userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              });
              const data = await response.json();
            
              console.log("data", data);
              if (!response.ok) {
                alert(data.error || "Error in fetching enquiry");
                return [];
              }
            
             return data.data;
        } else {
            return [];
        }
    }

    return (
        <div className=" max-w-[75%] mx-auto py-10 mb-10">
            <div className="mx-auto py-16 px-10 rounded-sm shadow-xl w-full space-y-10">
                <h1 className="text-blue-800 text-3xl font-semibold italic">Enquires</h1>

                <div>
                    {
                        (userOrders.length === 0) ? (
                            <div className='flex flex-col items-center justify-center gap-10'>
                                <h3 className='text-gray-400 '>You don&apos;t have any previous enquire</h3>
                                <CgSmile className='text-8xl text-gray-400' />
                                <Link href="/products">
                                    <div className="px-8 py-3 lg:w-[250px] rounded-md bg-red-400 hover:bg-red-500 text-center text-white font-semibold">Continue Shopping</div>
                                </Link>
                            </div>
                        ) : (
                            <div className=''>
                                {userOrders.map((orderData, index) => <OrderItemCard key={index} orderItem={orderData} />)}
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}

export default EnquirePage