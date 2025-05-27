"use client";

import { useUser } from '@/context/UserContext';
import { OrderItemType } from '@/lib/interfaces/OrderInterface';
import { CartItemType } from '@/lib/interfaces/CartInterface';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Link from 'next/link';

interface ProductType extends CartItemType {
    price?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    description: string;
}

interface FlattenedOrder {
    orderId: string;
    orderObjectId: string;
    user: {
        companyName: string;
        gstNumber: string;
        email: string;
        phone?: string;
    };
    item: {
        product: ProductType;
        quantity: number;
    };
    status: string;
    createdAt: string;
    customItems?: any[];
    totalAmount?: number;
}

const AdminAllOrders = () => {
    const { user } = useUser();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [userOrders, setUserOrders] = useState<OrderItemType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<OrderItemType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Fetch orders on mount
    useEffect(() => {
        setMounted(true);
        async function fetchData() {
            if (!user) {
                router.replace("/");
                return;
            }
            
            if (!(user.role === "admin" || user.role === "manager")) {
                router.replace("/");
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    toast.error(data.error || "Error in fetching orders");
                    return;
                }

                setUserOrders(data.data);
            } catch (error) {
                console.error("Error loading orders:", error);
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        }

        if (mounted) {
            fetchData();
        }
    }, [user, router, mounted]);

    // Calculate SQMM with type safety
    const calculateSQMM = (item: { product: ProductType }) => {
        const length = item.product.dimensions?.length || 0;
        const width = item.product.dimensions?.width || 0;
        const height = item.product.dimensions?.height || 0;
        return ((length * width * height) / 144) * 10;
    };

    // Flatten orders and items for display
    const flattenedOrders = useMemo(() => {
        if (!mounted || loading) return [];
        
        const query = searchQuery.toLowerCase().trim();
        
        // First, filter the orders
        const filteredOrders = userOrders.filter(order =>
            order.orderId?.toLowerCase().includes(query) ||
            order.user.companyName?.toLowerCase().includes(query) ||
            order.user.gstNumber?.toLowerCase().includes(query) ||
            order.items.some(item =>
                ((item.product as unknown) as ProductType).name.toLowerCase().includes(query) ||
                ((item.product as unknown) as ProductType).description?.toLowerCase().includes(query)
            )
        );

        // Then, flatten the orders and items
        return filteredOrders.flatMap(order =>
            order.items.map((item): FlattenedOrder => ({
                orderId: order.orderId || '',
                orderObjectId: order._id,
                user: {
                    companyName: order.user.companyName || '',
                    gstNumber: order.user.gstNumber || '',
                    email: order.user.email || '',
                    phone: order.user.phone || ''
                },
                item: {
                    product: {
                        ...(item.product as any),
                        _id: (item.product as any)._id || '',
                        sku: (item.product as any).sku || '',
                        images: (item.product as any).images || [],
                        name: (item.product as any).name || '',
                        category: (item.product as any).category || '',
                        description: (item.product as any).description || '',
                        price: (item.product as any).price || 0,
                        dimensions: (item.product as any).dimensions || { length: 0, width: 0, height: 0 }
                    } as unknown as ProductType,
                    quantity: item.quantity
                },
                status: order.status || 'enquiry',
                createdAt: order.createdAt,
                customItems: order.customItems,
                totalAmount: (order as any).totalAmount || (item.quantity * ((item.product as any).price || 0))
            }))
        );
    }, [userOrders, searchQuery, mounted, loading]);

    // Add filter functions
    const filterOrders = useMemo(() => {
        return flattenedOrders.filter(order => {
            const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
            const matchesSearch = searchTerm === '' || 
                order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user.gstNumber.toLowerCase().includes(searchTerm.toLowerCase());
            
            let matchesDate = true;
            if (dateFilter !== 'all') {
                const orderDate = new Date(order.createdAt);
                const today = new Date();
                const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                
                switch(dateFilter) {
                    case 'today':
                        matchesDate = orderDate.toDateString() === today.toDateString();
                        break;
                    case 'week':
                        matchesDate = orderDate >= lastWeek;
                        break;
                    case 'month':
                        matchesDate = orderDate >= lastMonth;
                        break;
                }
            }
            
            return matchesStatus && matchesSearch && matchesDate;
        });
    }, [flattenedOrders, statusFilter, dateFilter, searchTerm]);

    // Paginated orders
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filterOrders.slice(startIndex, endIndex);
    }, [filterOrders, currentPage, pageSize]);

    // Total pages calculation
    const totalPages = useMemo(() => 
        Math.ceil(filterOrders.length / pageSize)
    , [filterOrders.length, pageSize]);

    // Delete order function
    const handleDeleteOrder = async (orderId: string) => {
        if (!mounted || !user?.token) return;
        
        try {
            setDeletingOrderId(orderId);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.ok) {
                setUserOrders(prev => prev.filter(order => order._id !== orderId));
                toast.success("Order deleted successfully");
            } else {
                const data = await response.json();
                toast.error(data.error || "Failed to delete order");
            }
        } catch (error) {
            console.error("Error deleting order:", error);
            toast.error("Error deleting order");
        } finally {
            setDeletingOrderId(null);
        }
    };

    // Add export to Excel function
    const handleExportToExcel = () => {
        const exportData = filterOrders.map((orderItem, index) => ({
            "Sr No.": index + 1,
            "Order ID": orderItem.orderId,
            "Product Name": ((orderItem.item.product as unknown) as ProductType).name,
            "Description": ((orderItem.item.product as unknown) as ProductType).description || "N/A",
            "Company": orderItem.user.companyName,
            "GST Number": orderItem.user.gstNumber,
            "Quantity": orderItem.item.quantity,
            "Status": orderItem.status,
            "Date": new Date(orderItem.createdAt).toLocaleDateString(),
            "Email": orderItem.user.email,
            "Phone": orderItem.user.phone || "N/A"
        }));

        // Convert to CSV
        const headers = Object.keys(exportData[0]);
        const csvContent = [
            headers.join(","),
            ...exportData.map(row => 
                headers.map(header => {
                    const value = row[header as keyof typeof row];
                    // Escape commas and quotes in the value
                    const escaped = String(value).replace(/"/g, '""');
                    return `"${escaped}"`;
                }).join(",")
            )
        ].join("\n");

        // Create and download file
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Add handleStatusUpdate function
    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        if (!user?.token) {
            toast.error("Authentication required");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Failed to update order status");
                return;
            }

            // Update the local state
            setUserOrders(prevOrders => 
                prevOrders.map(order => 
                    order.orderId === orderId 
                        ? { ...order, status: newStatus }
                        : order
                )
            );

            toast.success("Order status updated successfully");
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error("Failed to update order status");
        }
    };

    // Show loading state
    if (!mounted || loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Order Details Modal
    const OrderDetailsModal = () => {
        if (!selectedOrder) return null;

        return (
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                        Order Details
                                    </Dialog.Title>
                                    <div className="mt-2 space-y-4">
                                        <p><span className="font-semibold">Order ID:</span> {selectedOrder.orderId}</p>
                                        <p><span className="font-semibold">Purchase Date:</span> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                                        <p><span className="font-semibold">GST No:</span> {selectedOrder.user.gstNumber}</p>
                                        
                                        <div className="mt-4">
                                            <h4 className="font-semibold text-lg mb-2">Products:</h4>
                                            {selectedOrder.items.map((item, index) => {
                                                const product = ((item.product as unknown) as ProductType);
                                                return (
                                                    <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                                                        <p className="font-medium">{product.name}</p>
                                                        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                                            <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
                                                            <p><span className="font-medium">SQMM:</span> {calculateSQMM({ product }).toFixed(2)}</p>
                                                            {product.price && (
                                                                <p><span className="font-medium">Price:</span> ₹{product.price}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {selectedOrder.customItems && selectedOrder.customItems.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="font-semibold text-lg mb-2">Custom Coils:</h4>
                                                {selectedOrder.customItems.map((item, index) => (
                                                    <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <p><span className="font-medium">Coil Type:</span> {item.coilType}</p>
                                                            <p><span className="font-medium">Height:</span> {item.height}</p>
                                                            <p><span className="font-medium">Length:</span> {item.length}</p>
                                                            <p><span className="font-medium">Rows:</span> {item.rows}</p>
                                                            <p><span className="font-medium">FPI:</span> {item.fpi}</p>
                                                            <p><span className="font-medium">Endplate Type:</span> {item.endplateType}</p>
                                                            <p><span className="font-medium">Circuit Type:</span> {item.circuitType}</p>
                                                            <p><span className="font-medium">Number of Circuits:</span> {item.numberOfCircuits}</p>
                                                            <p><span className="font-medium">Header Size:</span> {item.headerSize}</p>
                                                            <p><span className="font-medium">Tube Type:</span> {item.tubeType}</p>
                                                            <p><span className="font-medium">Fin Type:</span> {item.finType}</p>
                                                            <p><span className="font-medium">Distributor Holes:</span> {item.distributorHoles}</p>
                                                            <p><span className="font-medium">Inlet Connection:</span> {item.inletConnection}</p>
                                                            <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
                
                {/* Filters and Export Button */}
                <div className="flex flex-wrap gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <select
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="enquiry">Enquiry</option>
                        <option value="ordered">Ordered</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    
                    <select
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                    </select>

                    <button
                        onClick={handleExportToExcel}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Export to Excel
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                    <p className="text-2xl font-bold text-gray-900">{filterOrders.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Enquiries</h3>
                    <p className="text-2xl font-bold text-blue-600">
                        {filterOrders.filter(o => o.status.toLowerCase() === 'enquiry').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Active Orders</h3>
                    <p className="text-2xl font-bold text-green-600">
                        {filterOrders.filter(o => o.status.toLowerCase() === 'ordered').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Completed Orders</h3>
                    <p className="text-2xl font-bold text-purple-600">
                        {filterOrders.filter(o => o.status.toLowerCase() === 'completed').length}
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Sr No.</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Company</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">GST</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedOrders.map((orderItem, index) => {
                            const product = orderItem.item.product as ProductType;
                            return (
                                <tr key={`${orderItem.orderObjectId}-${index}`} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {((currentPage - 1) * pageSize) + index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <span 
                                            className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                            onClick={() => {
                                                const originalOrder = userOrders.find(o => o._id === orderItem.orderObjectId);
                                                if (originalOrder) {
                                                    setSelectedOrder(originalOrder);
                                                    setIsModalOpen(true);
                                                }
                                            }}
                                        >
                                            {orderItem.orderId}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <p className="line-clamp-2">{product.description}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {orderItem.user.companyName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {orderItem.user.gstNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {orderItem.item.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${orderItem.status.toLowerCase() === 'enquiry' ? 'bg-yellow-100 text-yellow-800' : 
                                            orderItem.status.toLowerCase() === 'ordered' ? 'bg-blue-100 text-blue-800' :
                                            orderItem.status.toLowerCase() === 'processing' ? 'bg-purple-100 text-purple-800' :
                                            orderItem.status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'}`}>
                                            {orderItem.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(orderItem.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    const originalOrder = userOrders.find(o => o._id === orderItem.orderObjectId);
                                                    if (originalOrder) {
                                                        setSelectedOrder(originalOrder);
                                                        setIsModalOpen(true);
                                                    }
                                                }}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                View
                                            </button>
                                            {orderItem.status.toLowerCase() === 'enquiry' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(orderItem.orderId, 'ordered')}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            {orderItem.status.toLowerCase() === 'ordered' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(orderItem.orderId, 'processing')}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Process
                                                </button>
                                            )}
                                            {orderItem.status.toLowerCase() === 'processing' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(orderItem.orderId, 'completed')}
                                                    className="text-purple-600 hover:text-purple-900"
                                                >
                                                    Complete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filterOrders.length)} of {filterOrders.length} results
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded ${
                            currentPage === 1 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded ${
                            currentPage === totalPages 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Order Details Modal */}
            <OrderDetailsModal />
        </div>
    );
}

export default AdminAllOrders;