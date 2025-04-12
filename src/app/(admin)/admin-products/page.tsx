"use client"
import AdminProductCard from "@/components/AdminProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/context/UserContext";
import { ProductAllTypeInterfact } from "@/data/allProducts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from 'react'

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
  const pageSize = 9;

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

  return (
    <section className="px-14 pt-10 pb-28 min-h-[60vh]">
      {/* Search Bar */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="w-full flex flex-row items-center justify-between gap-5">
          {/* Search Input */}
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

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-6">
        {loading && [...Array(9)].map((_, i) => (
          <div key={i} className="flex flex-row space-y-3 gap-x-16">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2 flex flex-col">
              <Skeleton className="h-4 w-[450px]" />
              <Skeleton className="h-4 w-[700px]" />
              <Skeleton className="h-12 w-[750px]" />
            </div>
          </div>
        ))}

        {currentPageProducts.map((product) => (
          <AdminProductCard key={product._id} product={product} />
        ))}
      </div>

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
    </section>
  )
}

export default AdminProductsPage