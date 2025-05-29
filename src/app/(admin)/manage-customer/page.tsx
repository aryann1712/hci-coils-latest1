"use client";

import AdminCustomerCard from '@/components/AdminCustomerCard';
import { useUser } from '@/context/UserContext';
import { EmployyeeAllInfoType } from '@/lib/interfaces/UserInterface';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";

interface EditFormData {
  name: string;
  email: string;
  status: string;
}

const ManageCustomerPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [customerList, setCustomerList] = useState<EmployyeeAllInfoType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<EmployyeeAllInfoType | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({ name: '', email: '', status: 'active' });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const pageSize = 9;

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      const data = await getCustomerList();
      setCustomerList(data);
    }

    if (!user) {
      router.replace("/");
      return;
    } else if (user.role != "admin") {
      router.replace("/");
      return;
    } else {
      fetchData();
    }
  }, [mounted, router, user]);

  // Filter customers by search query
  const filteredCustomers = useMemo(() => {
    let filtered = customerList;
    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.email.toLowerCase().includes(lowerQuery)
      );
    }
    return filtered;
  }, [customerList, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const currentPageCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCustomers.slice(startIndex, endIndex);
  }, [filteredCustomers, currentPage]);

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

  const handleEditClick = (customer: EmployyeeAllInfoType) => {
    setSelectedCustomer(customer);
    setEditFormData({
      name: customer.name || '',
      email: customer.email || '',
      status: customer.status ? 'active' : 'inactive'
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !user) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
      
      const response = await fetch(`${baseUrl}/api/customers/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          adminId: user.userId,
          updateId: selectedCustomer._id,
          status: editFormData.status === 'active'
        })
      });

      const responseData = await response.text();
      console.log('Response status:', response.status);
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(`Failed to update customer: ${responseData}`);
      }

      // Update local state
      setCustomerList(prevList => 
        prevList.map(cust => 
          cust._id === selectedCustomer._id 
            ? { 
                ...cust, 
                status: editFormData.status === 'active'
              }
            : cust
        )
      );

      toast.success('Customer status updated successfully', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#4CAF50',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
        },
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update customer', {
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

  const handleDeleteClick = async (customerId: string) => {
    if (!user) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
      const response = await fetch(`${baseUrl}/api/customers/${customerId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      setCustomerList(prevList => prevList.filter(cust => cust._id !== customerId));
      toast.success('Customer deleted successfully', {
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
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer', {
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

  async function getCustomerList(): Promise<EmployyeeAllInfoType[]> {
    if (user) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
        const res = await fetch(`${baseUrl}/api/customers/${user.userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          credentials: 'include'
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('API Error:', {
            status: res.status,
            statusText: res.statusText,
            body: errorText
          });
          toast.error("Error in fetching customers");
          return [];
        }

        const data = await res.json();
        return data.employees || [];
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Failed to fetch customers. Please try again.");
        return [];
      }
    }
    return [];
  }

  return (
    <div className="w-full px-2 md:px-0 md:max-w-[75%] mx-auto py-10 mb-10">
      <div className="mx-auto py-16 px-2 md:px-10 rounded-sm shadow-xl w-full space-y-10">
        <h1 className="text-blue-800 text-2xl md:text-3xl font-semibold italic">Manage Customer</h1>
        
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-full">
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name or email..."
              className="border p-1"
            />
          </div>
        </div>

        {/* Customer Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">S.No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                currentPageCustomers.map((customer, index) => (
                  <TableRow key={customer._id}>
                    <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{customer.name}</div>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        customer.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.status ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleEditClick(customer)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteClick(customer._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
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

        <div className='mt-5 p-4 bg-gray-100 rounded-md'>
          <h3 className='font-semibold text-sm md:text-lg'>User Role Permissions:</h3>
          <ul className='list-disc list-inside text-gray-700 text-xs md:text-base'>
            <li>Only Admin and Manager can upload and manage products.</li>
            <li>Admin can manage employee roles and change them.</li>
            <li>Users can only access the front end and have no access to manager roles or any administrative privileges.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageCustomerPage;