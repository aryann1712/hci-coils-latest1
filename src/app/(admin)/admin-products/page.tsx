"use client"
import AdminProductCard from "@/components/AdminProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'react-toastify';
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

// Define TypeScript interfaces for PDF document definition
interface PdfStyle {
  fontSize?: number;
  bold?: boolean;
  margin?: number[];
  italics?: boolean;
  border?: number[];
  borderColor?: string;
  alignment?: string;
}

interface PdfContent {
  text?: string;
  style?: string;
  image?: string;
  width?: number;
  margin?: number[];
  columns?: any[];
  stack?: any[];
  alignment?: string;
}

interface PdfDocumentDefinition {
  content: PdfContent[];
  styles: Record<string, PdfStyle>;
  pageMargins?: number[];
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: string;
  imageUrl: string;
  createdAt: string;
  sku?: string;
}

interface ApiResponse {
  success: boolean;
  data: Product[];
  error?: string;
}

const AdminProductsPage = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Filter the products by search query
  const filteredProducts = useMemo(() => {
    if (searchQuery.trim() === "") {
      return products;
    }
    
    const lowerQuery = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        (p.sku && p.sku.toLowerCase().includes(lowerQuery))
    );
  }, [products, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

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

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      const data = await getProductsFromAPI();
      setProducts(data);
    }

    if (!user) {
      router.replace("/");
      return;
    } else {
      fetchData();
    }
  }, [user, router]);

  if (!mounted) {
    return null;
  }

  async function getProductsFromAPI(): Promise<Product[]> {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5001";
      console.log('Fetching products from:', `${baseUrl}/api/products`);
      
      const response = await fetch(`${baseUrl}/api/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          url: `${baseUrl}/api/products`
        });
        toast.error(`Failed to fetch products: ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      console.log('Received data:', data);
      setLoading(false);
      return data.data || [];
    } catch (error) {
      setLoading(false);
      console.error('Fetch error:', error);
      toast.error('Failed to connect to the server. Please check if the backend is running.');
      return [];
    }
  }

  // Function to convert image URL to base64 for PDF
  const getImageDataUrl = async (imageUrl: string): Promise<string | null> => {
    try {
      // Check if it's already a data URL
      if (imageUrl.startsWith('data:')) {
        return imageUrl;
      }

      // Handle relative URLs - ensure proper URL construction
      let fullUrl;
      if (imageUrl.startsWith('http')) {
        fullUrl = imageUrl;
      } else {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
        fullUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
      }

      console.log("Fetching image from:", fullUrl);

      const response = await fetch(fullUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
      });

      if (!response.ok) {
        console.error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        return null;
      }

      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = (e) => {
          console.error("FileReader error:", e);
          reject(e);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image:', error);
      return null; // Return null if image can't be loaded
    }
  };

  // Function to download the catalog as PDF
  const downloadCatalogue = async () => {
    try {
      setLoading(true);

      // Dynamically import pdfMake only when needed (client-side)
      const pdfMake = await import('pdfmake/build/pdfmake');
      const pdfFonts = await import('pdfmake/build/vfs_fonts');

      const pdfMakeLib = pdfMake.default as any;
      const pdfFontsLib = pdfFonts as any;
      pdfMakeLib.vfs = pdfFontsLib.default.vfs;

      // Create document definition
      const docDefinition: PdfDocumentDefinition = {
        content: [
          { text: 'HCI-Coils Product Catalogue', style: 'header', alignment: 'center' },
          { text: `Generated on ${new Date().toLocaleDateString()}`, style: 'subheader' },
          { text: '\n' },
        ],
        styles: {
          header: {
            fontSize: 22,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          subheader: {
            fontSize: 10,
            margin: [0, 10, 0, 10]
          },
          productName: {
            fontSize: 12,
            bold: true,
            margin: [0, 0, 0, 5]
          },
          partCode: {
            fontSize: 6,
            italics: true,
            margin: [0, 0, 0, 5]
          },
          description: {
            fontSize: 8,
            margin: [0, 0, 0, 5]
          },
          tableSeparator: {
            margin: [0, 10, 0, 10],
            border: [0, 1, 0, 0],
            borderColor: '#cccccc'
          }
        },
        pageMargins: [40, 40, 40, 40]
      };

      // Process each product and create the PDF content
      for (const product of products) {
        const productColumns = [];

        // Process image for the left column
        if (product.imageUrl) {
          try {
            // Important: Convert the URL to a data URL
            const imageDataUrl = await getImageDataUrl(product.imageUrl);
            console.log(`Image processed for ${product.name}: ${imageDataUrl}`, imageDataUrl ? "SUCCESS" : "FAILED");

            if (imageDataUrl) {
              productColumns.push({
                width: 150,
                image: imageDataUrl, // Use the data URL directly
                fit: [140, 140],
                margin: [0, 0, 20, 0]
              });
            } else {
              // Fallback for failed image
              productColumns.push({
                width: 150,
                text: '(No image available)',
                style: 'description',
                margin: [0, 30, 20, 0]
              });
            }
          } catch (error) {
            console.error(`Error processing image for ${product.name}:`, error);
            productColumns.push({
              width: 150,
              text: '(Image error)',
              style: 'description',
              margin: [0, 30, 20, 0]
            });
          }
        } else {
          // No image available
          productColumns.push({
            width: 150,
            text: '(No image available)',
            style: 'description',
            margin: [0, 30, 20, 0]
          });
        }

        // Add product info column (right side)
        productColumns.push({
          width: '*',
          stack: [
            { text: product.name, style: 'productName' },
            { text: `Part Code: ${product.sku || 'N/A'}`, style: 'partCode' },
            { text: product.description, style: 'description' }
          ]
        });

        // Add the columns layout to the document
        docDefinition.content.push({
          columns: productColumns,
          margin: [0, 5, 0, 5]
        });

        // Add separator between products
        docDefinition.content.push({ text: '', style: 'tableSeparator' });
      }

      // Generate and download the PDF
      pdfMakeLib.createPdf(docDefinition).download('HCI-Coils-Product-Catalogue.pdf');

      setLoading(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setLoading(false);
      toast.error('Failed to generate catalogue. Please try again.');
    }
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${productToDelete._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts(products.filter((p) => p._id !== productToDelete._id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // Update the formatImageUrl function
  const formatImageUrl = (imageUrl: string | undefined | null) => {
    if (!imageUrl) return '/placeholder-image.png';
    
    
    // If it's already a full URL, return it as is
    if (imageUrl.startsWith('http')) return imageUrl;
    
    
    // If it's a relative URL starting with /uploads, prepend the base URL
    if (imageUrl.startsWith('/uploads')) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
      return `${baseUrl}${imageUrl}`;
      
    }
    
    // If it's a relative URL without /uploads, add it
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
    return `${baseUrl}/uploads/${imageUrl}`;
  
  };

  return (
    <section className="px-14 pt-10 pb-28 min-h-[60vh]">
      {/* Search Bar */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="w-full flex flex-row items-center justify-between gap-5">
          {/* Search Input */}
          <div className="flex-1">
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name, description, or part code..."
              className="border p-1"
            />
          </div>

          <div className="flex flex-row gap-3">
            <div
              className="bg-blue-800 hover:bg-blue-900 cursor-pointer px-5 py-2 text-white font-semibold rounded-md"
              onClick={downloadCatalogue}
            >
              {loading ? "Generating..." : "Download Full Catalogue"}
            </div>

            {/* Add Product Grid */}
            <Link href={"/admin-products/add-product"}>
              <div className="bg-blue-800 hover:bg-blue-900 cursor-pointer px-5 py-2 text-white font-semibold rounded-md">Add New Product</div>
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">S.No</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Part Code</TableHead>
              <TableHead>Price (₹)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">No products found</TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product, index) => (
                <TableRow key={product._id}>
                  <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell>
                    {product.imageUrl ? (
                      <div className="relative w-16 h-16">
                        <img 
                          src={formatImageUrl(product.imageUrl)} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                           const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.png';
                            target.onerror = null;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{product.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{product.description}</div>
                  </TableCell>
                  <TableCell>{product.sku || 'N/A'}</TableCell>
                  <TableCell>₹{product.price.toLocaleString('en-IN')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/admin-products/edit-product/${product._id}`)}
                        className="hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(product)}
                        className="hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              {productToDelete && ` "${productToDelete.name}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
          <span>Page {currentPage} of {totalPages}</span>
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  )
}

export default AdminProductsPage
