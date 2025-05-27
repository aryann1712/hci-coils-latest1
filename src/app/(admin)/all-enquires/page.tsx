"use client";

import { useUser } from '@/context/UserContext';
import { EnquireItemType } from '@/lib/interfaces/OrderInterface';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import EnquiryManagementTable from '@/components/EnquiryManagementTable';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

const AdminAllEnquires = () => {
    const { user } = useUser();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [userOrders, setUserOrders] = useState<EnquireItemType[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const pageSize = 10;

    useEffect(() => {
        setMounted(true);
        async function fetchData() {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/enquire`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch enquiries');
                }

                const data = await response.json();
                setUserOrders(data.data);
            } catch (error) {
                console.error('Error fetching enquiries:', error);
                toast.error(error instanceof Error ? error.message : 'Failed to fetch enquiries');
                setUserOrders([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
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

    const filteredOrders = useMemo(() => {
        if (!searchQuery.trim()) return userOrders;

        const query = searchQuery.trim().toLowerCase();
        return userOrders.filter(order => {
            // Search in enquiry ID
            if (order.enquiryId?.toLowerCase().includes(query)) return true;
            
            // Search in user details
            if (order.user.name?.toLowerCase().includes(query)) return true;
            if (order.user.email?.toLowerCase().includes(query)) return true;
            if (order.user.companyName?.toLowerCase().includes(query)) return true;
            if (order.user.gstNumber?.toLowerCase().includes(query)) return true;
            
            // Search in status
            if (order.status?.toLowerCase().includes(query)) return true;
            
            // Search in products
            if (order.items.some(item => 
                item.product.name.toLowerCase().includes(query) ||
                item.product.description.toLowerCase().includes(query) ||
                item.product.sku?.toLowerCase().includes(query)
            )) return true;

            // Search in custom items
            if (order.customItems?.some(item =>
                item.coilType?.toLowerCase().includes(query) ||
                item.tubeType?.toLowerCase().includes(query) ||
                item.finType?.toLowerCase().includes(query)
            )) return true;

            return false;
        });
    }, [userOrders, searchQuery]);

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / pageSize);
    const currentPageOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredOrders.slice(startIndex, endIndex);
    }, [filteredOrders, currentPage]);

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleUpdateStatus = async (enquiryId: string, newStatus: string) => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/enquire/${enquiryId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            // Update local state
            setUserOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === enquiryId
                        ? { ...order, status: newStatus }
                        : order
                )
            );

            toast.success('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted || loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Enquiry Management</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length} enquiries
                    </span>
                </div>
            </div>

            {/* Single Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search by enquiry ID, customer, company, product, status..."
                        className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        🔍
                    </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                    Search across all fields including enquiry ID, customer details, company, products, and status
                </p>
            </div>

            {/* Enquiry Table */}
            <EnquiryManagementTable
                enquiries={currentPageOrders}
                onUpdateStatus={handleUpdateStatus}
                currentPage={currentPage}
                pageSize={pageSize}
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            variant="outline"
                            size="sm"
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <Button
                                    key={i}
                                    variant={currentPage === i + 1 ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(i + 1)}
                                    className="w-8 h-8 p-0"
                                >
                                    {i + 1}
                                </Button>
                            ))}
                        </div>
                        <Button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            variant="outline"
                            size="sm"
                        >
                            Next
                        </Button>
                    </div>
                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                </div>
            )}
        </div>
    );
};

export default AdminAllEnquires;