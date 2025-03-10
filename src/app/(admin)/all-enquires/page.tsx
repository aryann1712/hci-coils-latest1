"use client";

import AdminOrderCheckItemCard from '@/components/AdminOrderCheckCard';
import { useUser } from '@/context/UserContext';
import { EnquireItemType } from '@/lib/interfaces/OrderInterface';
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
        let filtered = userOrders;

        // If there's a search query, filter
        const lowerQuery = searchQuery.trim().toLowerCase();
        if (lowerQuery) {
            filtered = filtered.filter((order) => {
                // Match on order fields
                const matchOrderName = order.items.some((item) => {
                    const matchProductName = item.product.name.toLowerCase().includes(lowerQuery);
                    const matchProductDesc = item.product.description.toLowerCase().includes(lowerQuery);
                    const matchProductCategory = item.product.category.toLowerCase().includes(lowerQuery);
                    const matchProductId = item.product._id.toLowerCase().includes(lowerQuery);
                    return matchProductName || matchProductDesc || matchProductCategory || matchProductId;
                });

                const matchGst = order.user.gstNumber?.toLowerCase().includes(lowerQuery) || false;
                const matchOrderDate = order.createdAt?.toLowerCase().includes(lowerQuery) || false;
                const matchOrderId = order.enquiryId?.toLowerCase().includes(lowerQuery) || false;
                const matchName = order.user.name?.toLowerCase().includes(lowerQuery) || false;
                const matchCompanyName = order.user.companyName?.toLowerCase().includes(lowerQuery) || false;
                const matchEmail = order.user.email?.toLowerCase().includes(lowerQuery) || false;
                const matchAddress = order.user.address?.toLowerCase().includes(lowerQuery) || false;

                // Return true if any of these conditions pass
                return (
                    matchOrderName ||
                    matchGst ||
                    matchOrderDate ||
                    matchOrderId ||
                    matchName ||
                    matchCompanyName ||
                    matchEmail ||
                    matchAddress
                );
            });
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

    // Excel export function
    const exportToExcel = () => {
        // Define the type for our export row
        type ExportRowType = {
            "S.No": number;
            "Enquiry ID": string;
            "Customer Name": string;
            "Company": string;
            "Email": string;
            "GST Number": string;
            "Address": string;
            "Enquiry Date": string;
            "Status": string;
            "Total Items": number;
            "Products": string;
        };

        // Format data for export
        const exportData: ExportRowType[] = filteredOrders.map((enquiry, index) => {
            return {
                "S.No": index + 1,
                "Enquiry ID": enquiry.enquiryId || "N/A",
                "Customer Name": enquiry.user.name || "N/A",
                "Company": enquiry.user.companyName || "N/A",
                "Email": enquiry.user.email || "N/A",
                "GST Number": enquiry.user.gstNumber || "N/A",
                "Address": enquiry.user.address || "N/A",
                "Enquiry Date": enquiry.createdAt || "N/A",
                "Status": enquiry.status || "N/A",
                "Total Items": enquiry.items.length,
                "Products": enquiry.items.map(item => 
                    `${item.product.name} (Qty: ${item.quantity})`
                ).join(", ")
            };
        });

        // Convert to CSV
        if (exportData.length === 0) {
            alert("No data to export");
            return;
        }

        const headers = Object.keys(exportData[0]);
        const csvRows = [];
        
        // Add headers
        csvRows.push(headers.join(','));
        
        // Add data rows
        for (const row of exportData) {
            const values = headers.map(header => {
                const value = row[header as keyof ExportRowType];
                const escaped = ('' + value).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }
        
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        // Create a link to download
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Enquiries_Export_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
        <div className="max-w-[75%] mx-auto py-10 mb-10">
            <div className="mx-auto py-16 px-10 rounded-sm shadow-xl w-full space-y-10">
                <div className="flex justify-between items-center">
                    <h1 className="text-blue-800 text-3xl font-semibold italic">All Enquires</h1>
                    <button 
                        onClick={exportToExcel}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export to Excel
                    </button>
                </div>

                <div className="flex justify-between items-center">
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
                    <div className="text-sm text-gray-600">
                        {filteredOrders.length} enquiries found
                    </div>
                </div>

                <div>
                    <div className=''>
                        {currentPageProducts.map((orderData, index) => (
                            <AdminOrderCheckItemCard key={index} enquireItem={orderData} />
                        ))}
                    </div>

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