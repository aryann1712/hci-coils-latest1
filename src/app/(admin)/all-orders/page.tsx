"use client";

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Package } from "lucide-react";

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  productName: string;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddress: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
}

const AllOrdersPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 10;

  const getOrders = async (): Promise<Order[]> => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        if (!user) {
          console.log('No user found, redirecting to home');
          router.replace("/");
          return [];
        }

        if (user.role !== "admin") {
          console.log('User is not admin, redirecting to home');
          router.replace("/");
          return [];
        }

        const token = localStorage.getItem("token");
        if (!token) {
          console.log('No token found, redirecting to home');
          router.replace("/");
          return [];
        }

        // First check if server is available
        try {
          const healthCheck = await fetch(`${baseUrl}/api/orders/health`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (!healthCheck.ok) {
            throw new Error('Server health check failed');
          }
        } catch (error) {
          console.error('Server health check failed:', error);
          if (retryCount < maxRetries - 1) {
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
            continue;
          }
          toast.error("Server is not responding. Please try again later.");
          return [];
        }

        // If server is available, proceed with fetching orders
        const response = await fetch(`${baseUrl}/api/orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Orders fetch error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
          });

          if (response.status === 401 || response.status === 403) {
            console.log('Authentication error, redirecting to home');
            router.replace("/");
          } else {
            if (retryCount < maxRetries - 1) {
              retryCount++;
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
              continue;
            }
            toast.error(errorData.message || "Failed to fetch orders");
          }
          return [];
        }

        const data = await response.json();
        
        if (!data || !Array.isArray(data)) {
          console.error('Invalid response format:', data);
          toast.error("Invalid response from server");
          return [];
        }

        return data;
      } catch (error) {
        console.error('Error in getOrders:', error);
        if (retryCount < maxRetries - 1) {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          continue;
        }
        toast.error("Failed to fetch orders. Please try again.");
        return [];
      }
    }

    return [];
  };

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error in fetchData:', error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (mounted && user) {
      fetchData();
    }
  }, [mounted, user]);

  // Filter orders by search query
  const filteredOrders = orders.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    return (
      order.customerName.toLowerCase().includes(searchLower) ||
      order.customerEmail.toLowerCase().includes(searchLower) ||
      order._id.toLowerCase().includes(searchLower) ||
      order.status.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const currentPageOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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

  const handleViewClick = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
      const response = await fetch(`${baseUrl}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          status: newStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );

      toast.success('Order status updated successfully', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#4CAF50',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
        },
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#f44336',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
        },
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full px-2 md:px-0 md:max-w-[75%] mx-auto py-10 mb-10">
        <div className="mx-auto py-16 px-2 md:px-10 rounded-sm shadow-xl w-full space-y-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 md:px-0 md:max-w-[75%] mx-auto py-10 mb-10">
      <div className="mx-auto py-16 px-2 md:px-10 rounded-sm shadow-xl w-full space-y-10">
        <h1 className="text-blue-800 text-2xl md:text-3xl font-semibold italic">All Orders</h1>
        
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-full">
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by customer name, email, or order ID..."
              className="border p-1"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">S.No</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                currentPageOrders.map((order, index) => (
                  <TableRow key={order._id}>
                    <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                    <TableCell className="font-medium">{order._id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order._id, value)}
                      >
                        <SelectTrigger className={`w-[130px] ${getStatusColor(order.status)}`}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleViewClick(order)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* View Order Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Order ID</Label>
                    <div className="text-sm">{selectedOrder._id}</div>
                  </div>
                  <div>
                    <Label>Order Date</Label>
                    <div className="text-sm">{formatDate(selectedOrder.createdAt)}</div>
                  </div>
                  <div>
                    <Label>Customer Name</Label>
                    <div className="text-sm">{selectedOrder.customerName}</div>
                  </div>
                  <div>
                    <Label>Customer Email</Label>
                    <div className="text-sm">{selectedOrder.customerEmail}</div>
                  </div>
                  <div>
                    <Label>Shipping Address</Label>
                    <div className="text-sm">{selectedOrder.shippingAddress}</div>
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <div className="text-sm">{selectedOrder.paymentMethod}</div>
                  </div>
                </div>

                <div>
                  <Label>Order Items</Label>
                  <div className="mt-2 space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                        </div>
                        <div className="font-medium">${item.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="font-medium">Total Amount</div>
                  <div className="font-bold text-lg">${selectedOrder.totalAmount.toFixed(2)}</div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrdersPage;