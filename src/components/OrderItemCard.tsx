"use client";
import { OrderItemType, CustomCoilItemType } from '@/lib/interfaces/OrderInterface';
import { formatProductName } from '@/lib/utils';
import Image from 'next/image';

interface ProductType {
    _id: string;
    name: string;
    description: string;
    sku: string;
    images: string[];
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
}

const OrderItemCard = ({ orderItem }: { orderItem: OrderItemType }) => {
  return (
    <div className='shadow-md rounded-md my-5 py-5  px-1 md:px-5 border-dashed border flex flex-row gap-5 items-center justify-center'>
      <div className=''>
        <div className='text-xs md:text-sm text-gray-400'>
          <h1>Order Id: {orderItem.orderId}</h1>
          <h1>Purchase Date: {orderItem.createdAt}</h1>
          <h1>GST No: {orderItem.user.gstNumber}</h1>
        </div>
        {orderItem.items.map((item, index) => {
          const product = item.product as unknown as ProductType;
          return (
            <div key={index} className='grid grid-cols-4 items-center py-5 px-2 md:px-5 border-b'>
              {/* Image */}
              <div>
                <Image
                  src={product.images?.[0] || '/logo.png'}
                  alt={formatProductName(product)}
                  width={1000}
                  height={1000}
                  className="w-[100px] h-[70px] md:h-[100px] md:w-[150px] rounded-md object-cover"
                />
              </div>

              {/* Name and Description */}
              <div className="col-span-2 flex flex-col px-2 md:px-4">
                <h1 className="text-sm md:text-lg font-semibold">{formatProductName(product)}</h1>
                <h1 className="text-xs md:text-xs font-gray-600 font-semibold">Part Code: {product.sku || ''}</h1>
                {product.dimensions && (
                  <h1 className="text-xs md:text-xs font-gray-600 font-semibold">
                    Dimensions: {product.dimensions.length || 0} x {product.dimensions.width || 0} x {product.dimensions.height || 0}
                  </h1>
                )}
                <p className="text-xs md:text-sm text-gray-600 line-clamp-2 md:line-clamp-3 font-semibold">{product.description || ''}</p>
              </div>

              {/* Quantity */}
              <div className="flex flex-col justify-center">
                <h1 className="text-xs text-gray-400 font-semibold">Qty</h1>
                <h1 className="text-lg font-semibold">{item.quantity}</h1>
              </div>
            </div>
          );
        })}
        {orderItem.customItems && orderItem.customItems.map((item: CustomCoilItemType, index) => (
          <div key={index} className='grid grid-cols-4 items-center py-5 px-2 md:px-5 border-b'>
            {/* Image */}
            <div>
              <Image
                src="/custom-coil-info1.png"
                alt="Custom Coil"
                width={1000}
                height={1000}
                className="w-[100px] h-[70px] md:h-[100px] md:w-[150px] rounded-md object-cover"
              />
            </div>

            {/* Name and Description */}
            <div className="col-span-2 flex flex-col px-2 md:px-4">
              <h1 className="text-sm md:text-lg font-semibold">{item.coilType}</h1>
              <div className="text-xs md:text-sm text-gray-600 grid grid-cols-1">
                <p><span className="font-semibold mr-2">Height:</span> {item.height}</p>
                <p><span className="font-semibold mr-2">Length:</span> {item.length}</p>
                <p><span className="font-semibold mr-2">Rows:</span> {item.rows}</p>
                <p><span className="font-semibold mr-2">FPI:</span> {item.fpi}</p>
                <p><span className="font-semibold mr-2">Endplate Type:</span> {item.endplateType}</p>
                <p><span className="font-semibold mr-2">Circuit Type:</span> {item.circuitType}</p>
                <p><span className="font-semibold mr-2">Number of Circuits:</span> {item.numberOfCircuits}</p>
                <p><span className="font-semibold mr-2">Header Size:</span> {item.headerSize}</p>
                <p><span className="font-semibold mr-2">Tube Type:</span> {item.tubeType}</p>
                <p><span className="font-semibold mr-2">Fin Type:</span> {item.finType}</p>
                <p><span className="font-semibold mr-2">Distributor Holes:</span> {item.distributorHoles}</p>
                <p><span className="font-semibold mr-2">Inlet Connection:</span> {item.inletConnection}</p>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex flex-col justify-center">
              <h1 className="text-xs text-gray-400 font-semibold">Qty</h1>
              <h1 className="text-lg font-semibold">{item.quantity}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItemCard;