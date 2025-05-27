import React, { useState } from 'react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EnquiryItemType } from "@/lib/interfaces/OrderInterface";

interface EnquiryManagementTableProps {
  enquiries: EnquiryItemType[];
  onUpdateStatus: (id: string, newStatus: string) => void;
  currentPage: number;
  pageSize: number;
}

const EnquiryManagementTable = ({ enquiries, onUpdateStatus, currentPage, pageSize }: EnquiryManagementTableProps) => {
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItemType | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const handleViewDetails = (enquiry: EnquiryItemType) => {
    setSelectedEnquiry(enquiry);
    setIsDetailsModalOpen(true);
  };

  const handleStatusChange = (enquiry: EnquiryItemType) => {
    setSelectedEnquiry(enquiry);
    setNewStatus(enquiry.status);
    setIsStatusModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedEnquiry) return;
    await onUpdateStatus(selectedEnquiry._id, newStatus);
    setIsStatusModalOpen(false);
    setSelectedEnquiry(null);
  };

  return (
    <>
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[60px] text-center">Sr. No.</TableHead>
              <TableHead className="w-[120px]">Enquiry ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>GST No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center w-[180px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiries.map((enquiry, index) => (
              <TableRow key={enquiry._id}>
                <TableCell className="font-medium text-center">
                  {(currentPage - 1) * pageSize + index + 1}
                </TableCell>
                <TableCell className="font-medium">
                  <span 
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    onClick={() => handleViewDetails(enquiry)}
                  >
                    {enquiry.enquiryId}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{enquiry.user.name}</span>
                    <span className="text-sm text-gray-500">{enquiry.user.email}</span>
                  </div>
                </TableCell>
                <TableCell>{enquiry.user.companyName}</TableCell>
                <TableCell>{enquiry.user.gstNumber}</TableCell>
                <TableCell>{new Date(enquiry.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span 
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      enquiry.status === 'Requested' ? 'bg-yellow-100 text-yellow-800' :
                      enquiry.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      enquiry.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      enquiry.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {enquiry.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleViewDetails(enquiry)}
                      className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 text-lg"
                      title="View Details"
                    >
                      👁️
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStatusChange(enquiry)}
                      className="h-8 w-8 hover:bg-green-50 hover:text-green-600 text-lg"
                      title="Update Status"
                    >
                      ✏️
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
            <DialogDescription>
              Detailed information about the enquiry
            </DialogDescription>
          </DialogHeader>
          {selectedEnquiry && (
            <div className="py-4 space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedEnquiry.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedEnquiry.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium">{selectedEnquiry.user.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">GST Number</p>
                    <p className="font-medium">{selectedEnquiry.user.gstNumber}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{selectedEnquiry.user.address}</p>
                  </div>
                </div>
              </div>

              {/* Regular Products */}
              {selectedEnquiry.items.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Regular Products</h3>
                  <div className="space-y-4">
                    {selectedEnquiry.items.map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex gap-4">
                          <div className="relative w-24 h-24 flex-shrink-0">
                            <Image
                              src={item.product.imageUrl || '/placeholder-product.png'}
                              alt={item.product.name || 'Product image'}
                              fill
                              className="object-contain rounded-md"
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-product.png';
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product.name}</h4>
                            <p className="text-sm text-gray-600">{item.product.description}</p>
                            <p className="text-sm mt-1">Part Code: {item.product.sku}</p>
                            <p className="text-sm">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Coils */}
              {selectedEnquiry.customItems && selectedEnquiry.customItems.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Custom Coils</h3>
                  <div className="space-y-4">
                    {selectedEnquiry.customItems.map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex gap-4">
                          <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                            <span className="text-gray-400 text-sm">Custom Coil</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium mb-2">
                              {item.coilType} Coil (Quantity: {item.quantity})
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Height</p>
                                <p className="font-medium">{item.height}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Length</p>
                                <p className="font-medium">{item.length}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Rows</p>
                                <p className="font-medium">{item.rows}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">FPI</p>
                                <p className="font-medium">{item.fpi}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Endplate Type</p>
                                <p className="font-medium">{item.endplateType}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Circuit Type</p>
                                <p className="font-medium">{item.circuitType}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Number of Circuits</p>
                                <p className="font-medium">{item.numberOfCircuits}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Header Size</p>
                                <p className="font-medium">{item.headerSize}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Tube Type</p>
                                <p className="font-medium">{item.tubeType}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Fin Type</p>
                                <p className="font-medium">{item.finType}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Distributor Holes</p>
                                <p className="font-medium">
                                  {item.distributorHolesDontKnow ? 'Not specified' : item.distributorHoles}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Inlet Connection</p>
                                <p className="font-medium">
                                  {item.inletConnectionDontKnow ? 'Not specified' : item.inletConnection}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Enquiry Status</DialogTitle>
            <DialogDescription>
              Change the status of enquiry {selectedEnquiry?.enquiryId}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="Requested">Requested</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmStatusChange}
              className="bg-green-600 hover:bg-green-700"
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnquiryManagementTable; 