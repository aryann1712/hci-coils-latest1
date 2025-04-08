"use client";
import { EnquireItemType, OrderItemType } from '@/lib/interfaces/OrderInterface';
import Image from 'next/image';

const AdminOrderCheckItemCard = ({ orderItem, enquireItem }: { orderItem?: OrderItemType, enquireItem?: EnquireItemType }) => {


  return (
    <div className='shadow-md rounded-md my-5 py-5 px-2 md:px-5 border-dashed border flex flex-row gap-5 items-center justify-center'>

      {orderItem && <div className=''>
        <div className='text-xs md:text-sm text-gray-400'>
          <h1>Order Id: {orderItem.orderId || ''}</h1>
          <h1>Purchase Date: {orderItem.createdAt || ''}</h1>
          <h1>GST No: {orderItem.user.gstNumber || ''}</h1>

        </div>
        {orderItem.items.map((item, index) =>
        (
          <div key={index} className='grid grid-cols-4 items-center py-5 px-2 md:px-5 border-b'>
            {/* Image */}
            <div>
              <Image
                src={item.product.images[0] || '/logo.png'}
                alt={item.product.name || ''}
                width={1000}
                height={1000}
                className="h-[100px] w-[150px] rounded-md object-cover"
              />
            </div>

            {/* Name and Description */}
            <div className="col-span-2 flex flex-col px-4">
              <h1 className="text-sm md:text-lg font-semibold">{item.product.name || ''}</h1>
              <p className="text-xs md:text-sm text-gray-600 line-clamp-2 md:line-clamp-3">{item.product.description || ''}</p>
            </div>

            {/* Quantity */}
            <div className="flex flex-col justify-center">
              <h1 className="text-xs  text-gray-400 font-semibold">Qty</h1>
              <h1 className="text-base md:text-lg font-semibold">{item.quantity || ''}</h1>
            </div>

          </div>
        ))}


        {orderItem.customItems.map((item, index) =>
        (
          <div key={index} className='grid grid-cols-4 items-center py-5 px-2 md:px-5 border-b'>
            {/* Image */}
            <div>
              <Image
                src={"/custom-coil-info1.png"}
                alt={"custom coil"}
                width={1000}
                height={1000}
                className="h-[100px] w-[150px] rounded-md object-cover"
              />
            </div>


            {/* Name and Description */}
            <div className="col-span-2 flex flex-col px-2 md:px-4">
              <h1 className="text-sm md:text-lg font-semibold">{item.coilType}</h1>
              <div className="text-xs md:text-sm text-gray-600 grid grid-cols-1">
                <p><span className="font-semibold mr-2">coilType:</span> {item.coilType}</p>
                <p><span className="font-semibold  mr-2">height:</span> {item.height}</p>
                <p><span className="font-semibold mr-2">length:</span> {item.length}</p>
                <p><span className="font-semibold mr-2">rows:</span> {item.rows}</p>
                <p><span className="font-semibold mr-2">fpi:</span> {item.fpi}</p>
                <p><span className="font-semibold mr-2">endplateType:</span> {item.endplateType}</p>
                <p><span className="font-semibold mr-2">circuitType:</span> {item.circuitType}</p>
                <p><span className="font-semibold mr-2">numberOfCircuits:</span> {item.numberOfCircuits}</p>
                <p><span className="font-semibold mr-2">headerSize:</span> {item.headerSize}</p>
                <p><span className="font-semibold mr-2">tubeType:</span> {item.tubeType}</p>
                <p><span className="font-semibold mr-2">finType:</span> {item.finType}</p>
                <p><span className="font-semibold mr-2">distributorHoles:</span> {item.distributorHoles}</p>
                <p><span className="font-semibold mr-2">distributorHolesDontKnow:</span> {item.distributorHolesDontKnow ? 'Yes' : 'No'}</p>
                <p><span className="font-semibold mr-2">inletConnection:</span> {item.inletConnection}</p>
                <p><span className="font-semibold mr-2">inletConnectionDontKnow:</span> {item.inletConnectionDontKnow ? 'Yes' : 'No'}</p>
                <p><span className="font-semibold mr-2">quantity:</span> {item.quantity}</p>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex flex-col justify-center">
              <h1 className="text-xs  text-gray-400 font-semibold">Qty</h1>
              <h1 className="text-lg font-semibold">{item.quantity}</h1>
            </div>

          </div>
        ))}
      </div>}


      {enquireItem && <div className=''>
        <div className='text-xs md:text-sm text-gray-400'>
          <h1>Order Id: {enquireItem.enquiryId || ''}</h1>
          <h1>Purchase Date: {enquireItem.createdAt || ''}</h1>
          <h1>GST No: {enquireItem.user.gstNumber || ''}</h1>

        </div>
        {enquireItem.items.map((item, index) =>
        (
          <div key={index} className='grid grid-cols-4 items-center py-5 px-2 md:px-5 border-b'>
            {/* Image */}
            <div>
              <Image
                src={item.product.images[0] || '/logo.png'}
                alt={item.product.name || ''}
                width={1000}
                height={1000}
                className="h-[100px] w-[150px] rounded-md object-cover"
              />
            </div>

            {/* Name and Description */}
            <div className="col-span-2 flex flex-col px-4">
              <h1 className="text-sm md:text-lg font-semibold">{item.product.name || ''}</h1>
              <p className="text-xs md:text-sm text-gray-600 line-clamp-2 md:line-clamp-3">{item.product.description || ''}</p>
            </div>

            {/* Quantity */}
            <div className="flex flex-col justify-center">
              <h1 className="text-xs  text-gray-400 font-semibold">Qty</h1>
              <h1 className="text-base md:text-lg font-semibold">{item.quantity || ''}</h1>
            </div>

          </div>
        ))}
        {enquireItem.customItems.map((item, index) =>
        (
          <div key={index} className='grid grid-cols-4 items-center py-5 px-2 md:px-5 border-b'>
            {/* Image */}
            <div>
              <Image
                src={"/custom-coil-info1.png"}
                alt={"custom coil"}
                width={1000}
                height={1000}
                className="h-[100px] w-[150px] rounded-md object-cover"
              />
            </div>


            {/* Name and Description */}
            <div className="col-span-2 flex flex-col px-2 md:px-4">
              <h1 className="text-sm md:text-lg font-semibold">{item.coilType}</h1>
              <div className="text-xs md:text-sm text-gray-600 grid grid-cols-1">
                <p><span className="font-semibold mr-2">coilType:</span> {item.coilType}</p>
                <p><span className="font-semibold  mr-2">height:</span> {item.height}</p>
                <p><span className="font-semibold mr-2">length:</span> {item.length}</p>
                <p><span className="font-semibold mr-2">rows:</span> {item.rows}</p>
                <p><span className="font-semibold mr-2">fpi:</span> {item.fpi}</p>
                <p><span className="font-semibold mr-2">endplateType:</span> {item.endplateType}</p>
                <p><span className="font-semibold mr-2">circuitType:</span> {item.circuitType}</p>
                <p><span className="font-semibold mr-2">numberOfCircuits:</span> {item.numberOfCircuits}</p>
                <p><span className="font-semibold mr-2">headerSize:</span> {item.headerSize}</p>
                <p><span className="font-semibold mr-2">tubeType:</span> {item.tubeType}</p>
                <p><span className="font-semibold mr-2">finType:</span> {item.finType}</p>
                <p><span className="font-semibold mr-2">distributorHoles:</span> {item.distributorHoles}</p>
                <p><span className="font-semibold mr-2">distributorHolesDontKnow:</span> {item.distributorHolesDontKnow ? 'Yes' : 'No'}</p>
                <p><span className="font-semibold mr-2">inletConnection:</span> {item.inletConnection}</p>
                <p><span className="font-semibold mr-2">inletConnectionDontKnow:</span> {item.inletConnectionDontKnow ? 'Yes' : 'No'}</p>
                <p><span className="font-semibold mr-2">quantity:</span> {item.quantity}</p>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex flex-col justify-center">
              <h1 className="text-xs  text-gray-400 font-semibold">Qty</h1>
              <h1 className="text-lg font-semibold">{item.quantity}</h1>
            </div>

          </div>
        ))}
      </div>}
    </div>
  )
}

export default AdminOrderCheckItemCard