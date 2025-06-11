"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  status: "new" | "in-progress" | "responded" | "closed";
  createdAt: string;
}

// pagination page size kept outside so it is not re-created on every render
const ITEMS_PER_PAGE = 10;

export default function EnquiriesManagement() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Enquiry["status"] | "all">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5001";
      const response = await fetch(`${baseUrl}/api/enquire`);
      if (!response.ok) throw new Error("Failed to fetch enquiries");
      const data = await response.json();
      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch enquiries");
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.company.toLowerCase().includes(q) ||
      e.subject.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEnquiries.length / ITEMS_PER_PAGE);
  const paginated = filteredEnquiries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-2xl font-bold">Enquiries Management</h1>

      {/* Search + status filter */}
      <div className="mb-6 flex gap-4">
        <Input
          placeholder="Search enquiries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as Enquiry["status"] | "all")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in-progress">In&nbsp;Progress</SelectItem>
            <SelectItem value="responded">Responded</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Loading…
                </TableCell>
              </TableRow>
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No enquiries found
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((e) => (
                <TableRow key={e._id}>
                  <TableCell>{e.name}</TableCell>
                  <TableCell>{e.email}</TableCell>
                  <TableCell>{e.phone}</TableCell>
                  <TableCell>{e.company}</TableCell>
                  <TableCell>{e.subject}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        e.status === "new"
                          ? "bg-blue-100 text-blue-800"
                          : e.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : e.status === "responded"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {e.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(e.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2">
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      Reply
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
