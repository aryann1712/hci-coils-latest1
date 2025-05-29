"use client";

import AdminUserDetailsCard from '@/components/AdminUserDetailsCard';
import { useUser } from '@/context/UserContext';
import { EmployyeeAllInfoType } from '@/lib/interfaces/UserInterface';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";

interface EditFormData {
  name: string;
  email: string;
  role: string;
  status: string;
}

const ManageEmployeePage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [employeeList, setEmployeeList] = useState<EmployyeeAllInfoType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployyeeAllInfoType | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: '',
    email: '',
    role: '',
    status: ''
  });
  const pageSize = 9;


  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      const data = await getEmployeeList();
      setEmployeeList(data);
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


  // Filter the products by category AND search query
  const filteredProducts = useMemo(() => {
    // 1) Category filter
    let filtered = employeeList;

    // 2) Search filter (case-insensitive match on product name OR description)
    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.email.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered;
  }, [employeeList, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const currentPageProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

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

  const handleEditClick = (employee: EmployyeeAllInfoType) => {
    setSelectedEmployee(employee);
    setEditFormData({
      name: employee.name || '',
      email: employee.email || '',
      role: employee.role || '',
      status: employee.status ? 'active' : 'inactive'
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !user) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
      
      // First update the role
      const roleResponse = await fetch(`${baseUrl}/api/employees/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          adminId: user.userId,
          updateId: selectedEmployee._id,
          role: editFormData.role
        })
      });

      if (!roleResponse.ok) {
        const errorData = await roleResponse.text();
        console.error('Role update error:', errorData);
        throw new Error('Failed to update employee role');
      }

      // Then update the status using the same endpoint
      const statusResponse = await fetch(`${baseUrl}/api/employees/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          adminId: user.userId,
          updateId: selectedEmployee._id,
          status: editFormData.status === 'active'
        })
      });

      if (!statusResponse.ok) {
        const errorData = await statusResponse.text();
        console.error('Status update error:', errorData);
        throw new Error('Failed to update employee status');
      }

      // Update local state
      setEmployeeList(prevList => 
        prevList.map(emp => 
          emp._id === selectedEmployee._id 
            ? { 
                ...emp, 
                role: editFormData.role,
                status: editFormData.status === 'active'
              }
            : emp
        )
      );

      toast.success('Employee updated successfully');
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update employee');
    }
  };

  const handleDeleteClick = async (employeeId: string) => {
    if (!user) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
      const response = await fetch(`${baseUrl}/api/employees/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      // Update local state
      setEmployeeList(prevList => prevList.filter(emp => emp._id !== employeeId));
      toast.success('Employee deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
    }
  };

  async function getEmployeeList(): Promise<EmployyeeAllInfoType[]> {
    if (user) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
        const res = await fetch(`${baseUrl}/api/employees/${user.userId}`, {
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
          alert("Error in fetching employees");
          return [];
        }

        const data = await res.json();
        return data.employees || [];
      } catch (error) {
        console.error("Error fetching employees:", error);
        alert("Failed to fetch employees. Please try again.");
        return [];
      }
    } else {
      return [];
    }
  }

  return (
    <div className="w-full px-2 md:px-0 md:max-w-[75%] mx-auto py-10 mb-10">
      <div className="mx-auto py-16 px-2 md:px-10 rounded-sm shadow-xl w-full space-y-10">
        <h1 className="text-blue-800 text-2xl md:text-3xl font-semibold italic">Manage Employee</h1>
        
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

        {/* Employee Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">S.No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No employees found
                  </TableCell>
                </TableRow>
              ) : (
                currentPageProducts.map((employee, index) => (
                  <TableRow key={employee._id}>
                    <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{employee.name}</div>
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        employee.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        employee.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {employee.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        employee.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.status ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleEditClick(employee)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteClick(employee._id)}
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
              <DialogTitle>Edit Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={editFormData.role}
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
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

export default ManageEmployeePage;