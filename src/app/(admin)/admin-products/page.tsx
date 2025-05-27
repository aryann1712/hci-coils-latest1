"use client"
import AdminProductCard from "@/components/AdminProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/context/UserContext";
import { ProductAllTypeInterfact } from "@/data/allProducts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from 'react'
import ProductManagementTable from "@/components/ProductManagementTable";
import { Button } from "@/components/ui/button";

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

const AdminProductsPage = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductAllTypeInterfact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter the products by category AND search query
  const filteredProducts = useMemo(() => {
    let filtered = products;
    // 1) Search filter (case-insensitive match on product name OR description)
    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered;
  }, [products, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const currentPageProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
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

  async function getProductsFromAPI(): Promise<ProductAllTypeInterfact[]> {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setLoading(false);

      console.log("data", data);
      if (!response.ok) {
        alert(data.error || "Sign in failed");
        return [];
      }
      return data.data;
    } catch (error) {
      setLoading(false);
      console.error(error);
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
        if (product.images && product.images.length > 0) {
          try {
            // Important: Convert the URL to a data URL
            const imageDataUrl = await getImageDataUrl(product.images[0]);
            // const imageDataUrl = product.images[0];
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
            { text: `Part Code: ${product.sku}`, style: 'partCode' },
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
      alert('Failed to generate catalogue. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok) {
        console.error(data.error || "Failed to delete product");
        return;
      }

      // Remove the product from the local state
      setProducts(products.filter(p => p._id !== productId));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length} products
          </span>
          <Link href="/admin-products/add-product">
            <Button>Add New Product</Button>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      ) : (
        <>
          <ProductManagementTable 
            products={currentPageProducts} 
            onDeleteProduct={handleDeleteProduct}
            currentPage={currentPage}
            pageSize={pageSize}
          />
          
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-2">
                <Button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                      className="w-8 h-8 p-0"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminProductsPage