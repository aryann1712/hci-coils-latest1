"use client";


import OrderItemCard from '@/components/OrderItemCard';
import { useUser } from '@/context/UserContext';
import { OrderItemType } from '@/lib/interfaces/OrderInterface';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CgSmile } from "react-icons/cg";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaExclamationCircle } from 'react-icons/fa';


const OrderPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [userOrders, setUserOrders] = useState<OrderItemType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        async function fetchData() {
            if (!user) {
                router.replace("/");
                return;
            }
            try {
                const data = await getUserOrder();
                setUserOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Failed to load orders", {
                    position: "top-right",
                    autoClose: 3000,
                    icon: <FaExclamationCircle className="text-white" />,
                    style: { background: '#ef4444', color: 'white' },
                    toastId: 'orders-error'
                });
            } finally {
                setLoading(false);
            }
        }

        if (mounted) {
            fetchData();
        }
    }, [user, mounted]);

    if (!mounted) {
        return null;
    }

    async function getUserOrder(): Promise<OrderItemType[]> {
        if (!user || !user.token) {
            toast.error("Please sign in to view orders", {
                position: "top-right",
                autoClose: 3000,
                icon: <FaExclamationCircle className="text-white" />,
                style: { background: '#ef4444', color: 'white' },
                toastId: 'orders-error'
            });
            router.push("/auth/signin");
            return [];
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/userid/${user.userId}`, {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch orders");
            }
            
            return data.data;
        } catch (error) {
            console.error("Error in getUserOrder:", error);
            throw error;
        }
    }

    if (loading) {
        return (
            <div className="w-full px-2 md:px-0 md:max-w-[75%] mx-auto py-10 mb-10">
                <div className="mx-auto py-16 px-2 md:px-10 rounded-sm shadow-xl w-full space-y-10">
                    <h1 className="text-blue-800 text-3xl font-semibold italic">Orders</h1>
                    <div className="flex justify-center items-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-2 md:px-0 md:max-w-[75%] mx-auto py-10 mb-10">
            <div className="mx-auto py-16 px-2 md:px-10 rounded-sm shadow-xl w-full space-y-10">
                <h1 className="text-blue-800 text-3xl font-semibold italic">Orders</h1>

                <div>
                    {
                        (userOrders.length === 0) ? (
                            <div className='flex flex-col items-center justify-center gap-10'>
                                <h3 className='text-gray-400'>You don&apos;t have any previous orders</h3>
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
    );
};

export default OrderPage