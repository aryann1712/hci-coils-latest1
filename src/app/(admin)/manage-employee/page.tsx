"use client";

import AdminUserDetailsCard from '@/components/AdminUserDetailsCard';
import { useUser } from '@/context/UserContext';
import { UserAllInfoType } from '@/lib/interfaces/UserInterface';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';


const ManageEmployeePage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [employeeList, setEmployeeList] = useState<UserAllInfoType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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


  async function getEmployeeList(): Promise<UserAllInfoType[]> {
    return [
      {
        userId: "123",
        role: "admin",
        address: "Vasundhara",
        companyName: "Apple",
        email: "rounakraj0309@gmail.com",
        gstNumber: "GSTIN123454665",
        name: "Rounak",
        phone: "9315045029"
      },
      ...Array.from({ length: 19 }, (_, i) => ({
        userId: (124 + i).toString(),
        role: i % 2 === 0 ? "user" : "manager",
        address: `Location ${i + 1}`,
        companyName: "Apple",
        email: `user${i + 1}@example.com`,
        gstNumber: "GSTIN123454665",
        name: `User ${i + 1}`,
        phone: `93150${45030 + i}`
      }))
    ];
  }

  return (
    <div className="max-w-[75%] mx-auto py-10 mb-10">
      <div className="mx-auto py-16 px-10 rounded-sm shadow-xl w-full space-y-10">
        <h1 className="text-blue-800 text-3xl font-semibold italic">Manage Employee</h1>
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
            (
              <div className=''>
                {<AdminUserDetailsCard userAllInfoTypes={currentPageProducts} />}
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
          <h3 className='font-semibold text-lg'>User Role Permissions:</h3>
          <ul className='list-disc list-inside text-gray-700'>
            <li>Only Admin and Manager can upload and manage products.</li>
            <li>Admin can manage employee roles and change them.</li>
            <li>Users can only access the front end and have no access to manager roles or any administrative privileges.</li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default ManageEmployeePage