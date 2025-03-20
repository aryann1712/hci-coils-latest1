"use client";
import { useCart } from '@/context/CartContext';
import { OrderItemType } from '@/lib/interfaces/OrderInterface';
import Image from 'next/image';
import { FaReply } from "react-icons/fa";

const OrderItemCard = ({ orderItem }: { orderItem: OrderItemType }) => {
  const { addToCart, addCustomCoilToCart } = useCart();


  const addItemsToCart = (() => {
    for (const item of orderItem.items) {
      item.product.quantity = item.quantity;
      addToCart(item.product);
    }
    for(const customItem of orderItem.customItems) {
      addCustomCoilToCart(customItem);
    }
  });

  return (
    <div className='shadow-md rounded-md my-5 py-5  px-1 md:px-5 border-dashed border flex flex-row gap-5 items-center justify-center'>
      <div className=''>
        <div className='text-xs md:text-sm text-gray-400'>
          <h1>Order Id: {orderItem.orderId}</h1>
          <h1>Purchase Date: {orderItem.createdAt}</h1>
          <h1>GST No: {orderItem.user.gstNumber}</h1>

        </div>
        {orderItem.items.map((item, index) =>
        (
          <div key={index} className='grid grid-cols-4 items-center py-5 px-2 md:px-5 border-b'>
            {/* Image */}
            <div>
              <Image
                src={item.product.images[0] || '/logo.png'}
                alt={item.product.name}
                width={1000}
                height={1000}
                className="w-[100px] h-[70px] md:h-[100px] md:w-[150px] rounded-md object-cover"
              />
            </div>


            {/* Name and Description */}
            <div className="col-span-2 flex flex-col px-2 md:px-4">
              <h1 className="text-sm md:text-lg font-semibold">{item.product.name}</h1>
              <p className="text-xs md:text-sm text-gray-600 line-clamp-2 md:line-clamp-3">{item.product.description}</p>
            </div>

            {/* Quantity */}
            <div className="flex flex-col justify-center">
              <h1 className="text-xs  text-gray-400 font-semibold">Qty</h1>
              <h1 className="text-lg font-semibold">{item.quantity}</h1>
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
                className="w-[100px] h-[70px] md:h-[100px] md:w-[150px] rounded-md object-cover"
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
      </div>
      <div className='group' >
        <div className='min-w-[70px] md:min-w-[200px] flex flex-col justify-center items-center cursor-pointer gap-y-2' onClick={() => addItemsToCart()}>
          <FaReply className='text-2xl md:text-4xl text-gray-400 group-hover:text-red-500' />
          <h1 className='font-semibold group-hover:text-red-500'>Add to cart</h1>
        </div>
      </div>
    </div>
  )
}

export default OrderItemCard