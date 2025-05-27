import React, { useState } from 'react';
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
import { ProductAllTypeInterfact } from "@/data/allProducts";
import Link from "next/link";
import Image from "next/image";
import { formatProductName } from '@/lib/utils';

interface ProductManagementTableProps {
  products: ProductAllTypeInterfact[];
  onDeleteProduct: (id: string) => void;
  currentPage: number;
  pageSize: number;
}

const ProductManagementTable = ({ products, onDeleteProduct, currentPage, pageSize }: ProductManagementTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductAllTypeInterfact | null>(null);

  const handleDeleteClick = (product: ProductAllTypeInterfact) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    setDeletingId(productToDelete._id);
    await onDeleteProduct(productToDelete._id);
    setDeletingId(null);
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  return (
    <>
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[60px] text-center">Sr. No.</TableHead>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Part Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Dimensions (L/W/H)</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-center w-[180px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product._id}>
                <TableCell className="font-medium text-center">
                  {(currentPage - 1) * pageSize + index + 1}
                </TableCell>
                <TableCell>
                  <div className="relative h-16 w-16">
                    <Image
                      src={product.images[0]}
                      alt={formatProductName(product)}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium max-w-[200px]">{formatProductName(product)}</TableCell>
                <TableCell className="font-mono">{product.sku}</TableCell>
                <TableCell className="max-w-[300px]">
                  <p className="truncate text-sm text-gray-600">{product.description}</p>
                </TableCell>
                <TableCell className="font-medium text-center">
                  {product.dimensions ? 
                    `${product.dimensions.length}/${product.dimensions.width}/${product.dimensions.height}` : 
                    '-'
                  }
                </TableCell>
                <TableCell className="font-medium">₹{product.price}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Link href={`/admin-products/edit-product/${product._id}`}>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 text-lg"
                        title="Edit Product"
                      >
                        ✏️
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(product)}
                      disabled={deletingId === product._id}
                      className={`h-8 w-8 hover:bg-red-50 hover:text-red-600 text-lg ${
                        deletingId === product._id ? "animate-pulse" : ""
                      }`}
                      title="Delete Product"
                    >
                      🗑️
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {productToDelete && (
            <div className="py-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16">
                  <Image
                    src={productToDelete.images[0]}
                    alt={formatProductName(productToDelete)}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div>
                  <p className="font-medium">{formatProductName(productToDelete)}</p>
                  <p className="text-sm text-gray-500">Part Code: {productToDelete.sku}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deletingId === productToDelete?._id}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deletingId === productToDelete?._id}
              className="gap-2"
            >
              {deletingId === productToDelete?._id ? (
                <>
                  <span className="animate-spin">⌛</span>
                  Deleting...
                </>
              ) : (
                <>
                  🗑️ Delete Product
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductManagementTable; 