"use client";


import AdminOrderCheckItemCard from '@/components/AdminOrderCheckCard';
import { useUser } from '@/context/UserContext';
import { EnquireItemType, OrderItemType } from '@/lib/interfaces/OrderInterface';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';


const AdminAllEnquires = () => {
    const { user } = useUser();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [userOrders, setUserOrders] = useState<EnquireItemType[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;



    useEffect(() => {
        setMounted(true);
        async function fetchData() {
            const data = await getUserOrder();
            setUserOrders(data);
        }

        if (!user) {
            router.replace("/");
            return;
        } else if (!(user.role === "admin" || user.role === "manager")) {
            router.replace("/");
            return;
        } else {
            fetchData();
        }

    }, [mounted, user, router]);


    // Filter the products by category AND search query
    const filteredOrders = useMemo(() => {
        // Start with the full array
        const filtered = userOrders;

        // If there's a search query, filter
        const lowerQuery = searchQuery.trim().toLowerCase();
        if (lowerQuery) {
            // filtered = filtered.filter((order) => {
            //     // Match on order fields
            //     // const matchOrderName = order.items.toLowerCase().includes(lowerQuery);
            //     // const matchGst = order.gstNumber.toLowerCase().includes(lowerQuery);
            //     // const matchOrderDate = order.orderDate.toLowerCase().includes(lowerQuery);
            //     // const matchOrderId = order.orderId.toLowerCase().includes(lowerQuery);
            //     // const matchPhone = order.phone.toLowerCase().includes(lowerQuery);

            //     // // Match on ANY product in the order
            //     // const matchAnyProduct = order.products.some((item) => {
            //     //     const matchProductName = item.name.toLowerCase().includes(lowerQuery);
            //     //     const matchdescription = item.description.toLowerCase().includes(lowerQuery);
            //     //     return matchProductName || matchdescription;
            //     // });

            //     // Return true if any of these conditions pass
            //     return (
            //         // matchOrderName ||
            //         // matchGst ||
            //         // matchOrderDate ||
            //         // matchOrderId ||
            //         // matchPhone ||
            //         // matchAnyProduct
            //         ''
            //     );
            // });
        }

        return filtered;
    }, [userOrders, searchQuery]);


    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / pageSize);
    const currentPageProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        console.log("refiltered page");
        return filteredOrders.slice(startIndex, endIndex);
    }, [filteredOrders, currentPage]);

    // Handlers
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };


    async function getUserOrder(): Promise<EnquireItemType[]> {
        if (user) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/enquire`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const data = await res.json();
                if (!res.ok) {
                    alert(data.error || "Error in fetching orders");
                    return [];
                }

                return data.data;
            } catch (error) {
                console.error("Error loading orders:", error);
                return [];
            }
        } else {
            return [];
        }
       
    }

    return (
        <div className=" max-w-[75%] mx-auto py-10 mb-10">
            <div className="mx-auto py-16 px-10 rounded-sm shadow-xl w-full space-y-10">
                <h1 className="text-blue-800 text-3xl font-semibold italic">All Enquires</h1>

                <div>
                    <label htmlFor="search" className="mr-2">
                        Search:
                    </label>
                    <input
                        id="search"
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search by name or desc..."
                        className="border p-1"
                    />
                </div>

                <div>
                    {
                        // (currentPageProducts.length === 0) ? (
                        //     <div className='flex flex-col items-center justify-center gap-10'>
                        //         <h3 className='text-gray-400 '>You don't have any previous order</h3>
                        //         <CgSmile className='text-8xl text-gray-400' />
                        //         <Link href="/products">
                        //             <div className="px-8 py-3 lg:w-[250px] rounded-md bg-red-400 hover:bg-red-500 text-center text-white font-semibold">Continue Shopping</div>
                        //         </Link>
                        //     </div>
                        // ) : 

                        (
                            // add here the logic of order Card
                            <div className=''>
                                {currentPageProducts.map((orderData, index) => <AdminOrderCheckItemCard key={index} enquireItem={orderData} />)}
                            </div>
                        )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center space-x-4 mt-6">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <span className="font-medium">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminAllEnquires