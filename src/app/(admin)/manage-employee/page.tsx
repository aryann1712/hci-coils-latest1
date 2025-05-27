"use client";

import AdminUserDetailsCard from '@/components/AdminUserDetailsCard';
import { useUser } from '@/context/UserContext';
import { EmployyeeAllInfoType } from '@/lib/interfaces/UserInterface';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaExclamationCircle } from 'react-icons/fa';


const ManageEmployeePage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [employees, setEmployees] = useState<EmployyeeAllInfoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;


  const getEmployeeList = useCallback(async () => {
    if (!user?.token) {
      throw new Error("Authentication required");
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/employees`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch employees");
    }
    return data.data;
  }, [user?.token]);

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      if (!user) {
        router.replace("/");
        return;
      }
      try {
        const data = await getEmployeeList();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Failed to load employees", {
          position: "top-right",
          autoClose: 3000,
          icon: <FaExclamationCircle className="text-white" />,
          style: { background: '#ef4444', color: 'white' },
          toastId: 'employees-error'
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user, router, getEmployeeList]);


  // Filter the products by category AND search query
  const filteredProducts = useMemo(() => {
    // 1) Category filter
    let filtered = employees;

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
  }, [employees, searchQuery]);

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


  return (
    <div className="w-full px-2 md:px-0 md:max-w-[75%] mx-auto py-10 mb-10">
      <div className="mx-auto py-16 px-2 md:px-10 rounded-sm shadow-xl w-full space-y-10">
        <h1 className="text-blue-800 text-2xl md:text-3xl font-semibold italic">Manage Employee</h1>
        <div>
          <label htmlFor="search" className="mr-2 text-sm md:text-base">
            Search:
          </label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name or desc..."
            className="border p-1 text-sm md:text-base"
          />
        </div>

        <div>
          {user &&
            (
              console.log(currentPageProducts),
              <div className=''>
                {<AdminUserDetailsCard userAllInfoTypes={currentPageProducts} currentUserId={user.userId} />}
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

        <div className='mt-5 p-4 bg-gray-100 rounded-md'>
          <h3 className='font-semibold text-sm md:text-lg'>User Role Permissions:</h3>
          <ul className='list-disc list-inside text-gray-700 text-xs md:text-base'>
            <li>Only Admin, Manager and Product Adder can upload and manage products.</li>
            <li>Admin can manage employee roles and change them.</li>
            <li>Users can only access the front end and have no access to manager roles or any administrative privileges.</li>
            <li>Product Manager can only access product Upload, Edit and Delete. But No Order Management, or Enquiry Management.</li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default ManageEmployeePage