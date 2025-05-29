"use client";

import EnquiryItemCard from '@/components/EnquiryItemCard';
import { useUser } from '@/context/UserContext';
import { EnquiryItemType } from '@/lib/interfaces/OrderInterface';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CgSmile } from "react-icons/cg";
import { toast } from 'react-hot-toast';

const EnquirePage = () => {
    const { user } = useUser();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [userOrders, setUserOrders] = useState<EnquiryItemType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        async function fetchData() {
            if (!user) {
                router.replace("/");
                return;
            }
            const data = await getUserOrder();
            setUserOrders(data);
            setLoading(false);
        }
        fetchData();
    }, [user, router]);

    if (!mounted) {
        return null;
    }

    async function getUserOrder(): Promise<EnquiryItemType[]> {
        if (!user) return [];

        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
            const token = localStorage.getItem('token');

            if (!token) {
                toast.error("Please log in again");
                return [];
            }

            console.log('Fetching enquiries for user:', user.userId);
            const response = await fetch(`${baseUrl}/api/enquire/userid/${user.userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                credentials: 'include'
            });

            console.log('Response status:', response.status);
            const responseText = await response.text();
            console.log('Raw response:', responseText);

            if (!response.ok) {
                let errorMessage = 'Failed to fetch enquiries';
                try {
                    const errorJson = JSON.parse(responseText);
                    errorMessage = errorJson.error || errorMessage;
                } catch (e) {
                    console.error('Failed to parse error response:', e);
                }
                toast.error(errorMessage);
                return [];
            }

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse response:', parseError);
                toast.error('Invalid response from server');
                return [];
            }

            if (!data || !data.success) {
                toast.error(data.error || 'Failed to fetch enquiries');
                return [];
            }

            return data.data || [];
        } catch (error) {
            console.error('Error fetching enquiries:', error);
            toast.error('Failed to fetch enquiries. Please try again later.');
            return [];
        }
    }

    if (loading) {
        return (
            <div className="w-full px-2 md:px-0 md:max-w-[75%] mx-auto py-10 mb-10">
                <div className="mx-auto py-16 px-2 md:px-10 rounded-sm shadow-xl w-full space-y-10">
                    <h1 className="text-blue-800 text-3xl font-semibold italic">Enquires</h1>
                    <div className="animate-pulse space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-2 md:px-0 md:max-w-[75%] mx-auto py-10 mb-10">
            <div className="mx-auto py-16 px-2 md:px-10 rounded-sm shadow-xl w-full space-y-10">
                <h1 className="text-blue-800 text-3xl font-semibold italic">Enquires</h1>

                <div>
                    {userOrders.length === 0 ? (
                        <div className='flex flex-col items-center justify-center gap-10'>
                            <h3 className='text-gray-400'>You don&apos;t have any previous enquire</h3>
                            <CgSmile className='text-8xl text-gray-400' />
                            <Link href="/products">
                                <div className="px-8 py-3 w-[250px] rounded-md bg-red-400 hover:bg-red-500 text-center text-white font-semibold transition-colors duration-200">
                                    Continue Shopping
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <div className='space-y-6'>
                            {userOrders.map((orderData, index) => (
                                <EnquiryItemCard key={orderData._id || index} orderItem={orderData} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EnquirePage;