"use client";

import AdminOrderCheckItemCard from '@/components/AdminOrderCheckCard';
import { useUser } from '@/context/UserContext';
import { OrderItemType } from '@/lib/interfaces/OrderInterface';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const AdminAllOrders = () => {
    const { user } = useUser();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [userOrders, setUserOrders] = useState<OrderItemType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;
    
    // Separate search states for each field
    const [searchFilters, setSearchFilters] = useState({
        productName: "",
        orderId: "",
        customerName: "",
        companyName: "",
        email: "",
        gstNumber: "",
        orderDate: ""
    });
    
    // Active filter to show which search field is currently displayed
    const [activeFilter, setActiveFilter] = useState<string | null>("productName");

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

    const filteredOrders = useMemo(() => {
        // Start with the full array
        let filtered = userOrders;

        // Apply each filter that has a value
        if (searchFilters.productName.trim()) {
            const query = searchFilters.productName.trim().toLowerCase();
            filtered = filtered.filter(order => 
                order.items.some(item => 
                    item.product.name.toLowerCase().includes(query) ||
                    item.product.description.toLowerCase().includes(query) ||
                    item.product.category.toLowerCase().includes(query) ||
                    item.product._id.toLowerCase().includes(query)
                )
            );
        }

        if (searchFilters.orderId.trim()) {
            const query = searchFilters.orderId.trim().toLowerCase();
            filtered = filtered.filter(order => 
                (order.orderId?.toLowerCase().includes(query) || false)
            );
        }

        if (searchFilters.customerName.trim()) {
            const query = searchFilters.customerName.trim().toLowerCase();
            filtered = filtered.filter(order => 
                (order.user.name?.toLowerCase().includes(query) || false)
            );
        }

        if (searchFilters.companyName.trim()) {
            const query = searchFilters.companyName.trim().toLowerCase();
            filtered = filtered.filter(order => 
                (order.user.companyName?.toLowerCase().includes(query) || false)
            );
        }

        if (searchFilters.email.trim()) {
            const query = searchFilters.email.trim().toLowerCase();
            filtered = filtered.filter(order => 
                (order.user.email?.toLowerCase().includes(query) || false)
            );
        }

        if (searchFilters.gstNumber.trim()) {
            const query = searchFilters.gstNumber.trim().toLowerCase();
            filtered = filtered.filter(order => 
                (order.user.gstNumber?.toLowerCase().includes(query) || false)
            );
        }

        if (searchFilters.orderDate.trim()) {
            const query = searchFilters.orderDate.trim().toLowerCase();
            filtered = filtered.filter(order => 
                (order.createdAt?.toLowerCase().includes(query) || false)
            );
        }

        return filtered;
    }, [userOrders, searchFilters]);

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / pageSize);
    const currentPageProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredOrders.slice(startIndex, endIndex);
    }, [filteredOrders, currentPage]);

    // Handlers
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setCurrentPage(1);
    };

    const handleFilterSelect = (filterName: string) => {
        setActiveFilter(activeFilter === filterName ? null : filterName);
    };

    const clearFilters = () => {
        setSearchFilters({
            productName: "",
            orderId: "",
            customerName: "",
            companyName: "",
            email: "",
            gstNumber: "",
            orderDate: ""
        });
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
            "Order ID": string;
            "Customer Name": string;
            "Company": string;
            "Email": string;
            "GST Number": string;
            "Address": string;
            "Order Date": string;
            "Total Items": number;
            "Products": string;
        };

        // Format data for export
        const exportData: ExportRowType[] = filteredOrders.map((order, index) => {
            return {
                "S.No": index + 1,
                "Order ID": order.orderId || "N/A",
                "Customer Name": order.user.name || "N/A",
                "Company": order.user.companyName || "N/A",
                "Email": order.user.email || "N/A",
                "GST Number": order.user.gstNumber || "N/A",
                "Address": order.user.address || "N/A",
                "Order Date": order.createdAt || "N/A",
                "Total Items": order.items.length,
                "Products": order.items.map(item => {
                    return `${item.product.name}  x (${item.quantity})`;
                }).join(",\n")
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
        link.setAttribute('download', `Orders_Export_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    async function getUserOrder(): Promise<OrderItemType[]> {
        if (user) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
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

    // Calculate how many filters are currently active
    const activeFiltersCount = Object.values(searchFilters).filter(value => value.trim() !== "").length;

    return (
        <div className="w-full px-2 md:px-0 md:max-w-[75%] mx-auto py-10 mb-10">
            <div className="mx-auto py-16 px-2 md:px-10 rounded-sm shadow-xl w-full space-y-10">
                <div className="flex justify-between items-center">
                    <h1 className="text-blue-800 text-2xl md:text-3xl font-semibold italic">All Orders</h1>
                    <button 
                        onClick={exportToExcel}
                        className="px-2 md:px-4 text-sm md:text-base py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export to Excel
                    </button>
                </div>

                {/* Search Filters UI */}
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <button 
                            onClick={() => handleFilterSelect("productName")}
                            className={`px-3 py-1 text-sm md:text-base rounded-md ${activeFilter === "productName" ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}
                        >
                            Product
                        </button>
                        <button 
                            onClick={() => handleFilterSelect("orderId")}
                            className={`px-3 py-1 text-sm md:text-base rounded-md ${activeFilter === "orderId" ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}
                        >
                            Order ID
                        </button>
                        <button 
                            onClick={() => handleFilterSelect("customerName")}
                            className={`px-3 py-1 text-sm md:text-base rounded-md ${activeFilter === "customerName" ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}
                        >
                            Customer
                        </button>
                        <button 
                            onClick={() => handleFilterSelect("companyName")}
                            className={`px-3 py-1 text-sm md:text-base rounded-md ${activeFilter === "companyName" ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}
                        >
                            Company
                        </button>
                        <button 
                            onClick={() => handleFilterSelect("email")}
                            className={`px-3 py-1 text-sm md:text-base rounded-md ${activeFilter === "email" ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}
                        >
                            Email
                        </button>
                        <button 
                            onClick={() => handleFilterSelect("gstNumber")}
                            className={`px-3 py-1 text-sm md:text-base rounded-md ${activeFilter === "gstNumber" ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}
                        >
                            GST
                        </button>
                        <button 
                            onClick={() => handleFilterSelect("orderDate")}
                            className={`px-3 py-1 text-sm md:text-base rounded-md ${activeFilter === "orderDate" ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}
                        >
                            Date
                        </button>
                        
                        {activeFiltersCount > 0 && (
                            <button 
                                onClick={clearFilters}
                                className="px-3 py-1 text-sm md:text-base rounded-md bg-red-500 text-white ml-auto"
                            >
                                Clear All ({activeFiltersCount})
                            </button>
                        )}
                    </div>
                    
                    {activeFilter && (
                        <div className="flex items-center gap-2">
                            <label htmlFor={activeFilter} className="text-sm md:text-base font-medium">
                                {activeFilter === "productName" && "Search by product:"}
                                {activeFilter === "orderId" && "Search by order ID:"}
                                {activeFilter === "customerName" && "Search by customer name:"}
                                {activeFilter === "companyName" && "Search by company:"}
                                {activeFilter === "email" && "Search by email:"}
                                {activeFilter === "gstNumber" && "Search by GST number:"}
                                {activeFilter === "orderDate" && "Search by order date:"}
                            </label>
                            <input
                                id={activeFilter}
                                name={activeFilter}
                                type="text"
                                value={searchFilters[activeFilter as keyof typeof searchFilters]}
                                onChange={handleSearchChange}
                                placeholder={`Enter ${activeFilter}...`}
                                className="border p-1 text-sm md:text-base flex-grow"
                            />
                            {searchFilters[activeFilter as keyof typeof searchFilters] && (
                                <button 
                                    onClick={() => {
                                        setSearchFilters(prev => ({
                                            ...prev,
                                            [activeFilter]: ""
                                        }));
                                    }}
                                    className="p-1 bg-gray-200 rounded-full"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}
                    
                    <div className="text-sm text-gray-600 flex justify-between">
                        <span>{filteredOrders.length} orders found</span>
                        {activeFiltersCount > 0 && (
                            <span className="text-blue-600">{activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied</span>
                        )}
                    </div>
                </div>

                <div className=''>
                        {currentPageProducts.length > 0 ? (
                            currentPageProducts.map((orderData, index) => <AdminOrderCheckItemCard key={index} orderItem={orderData} />)
                        ) : (
                            <div className="text-center py-10 bg-gray-50 rounded-md">
                                <p className="text-gray-500 text-lg">No orders match your search criteria</p>
                                {activeFiltersCount > 0 && (
                                    <button 
                                        onClick={clearFilters}
                                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        )}
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
    )
}

export default AdminAllOrders