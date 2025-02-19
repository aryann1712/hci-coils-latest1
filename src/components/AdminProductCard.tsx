"use client";

import { ProductInterface } from '@/lib/interfaces/ProductInterface';
import Image from 'next/image';
import { MdDelete, MdEdit } from 'react-icons/md';

const AdminProductCard = ({ product }: { product: ProductInterface }) => {

    return (
        <div className="grid grid-cols-4 items-center py-5  border-b">
            {/* Image */}
            <div>
                <Image
                    src={product.image}
                    alt={product.name}
                    width={1000}
                    height={1000}
                    className="h-[200px] w-[350px] rounded-md object-cover"
                />
            </div>

            {/* Name and Description */}
            <div className="col-span-2 flex flex-col px-4">
                <h1 className="text-lg font-semibold">{product.name}</h1>
                <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex gap-8 items-center justify-center">
                <MdEdit className="text-3xl mb-1 text-gray-500 hover:text-black" onClick={() => console.log("show are you sure want to delete and then delete it")} />
                <MdDelete className="text-3xl mb-1 text-gray-500 hover:text-black" onClick={() => console.log("show are you sure want to delete and then delete it")} />
            </div>
        </div>
    );
}

export default AdminProductCard