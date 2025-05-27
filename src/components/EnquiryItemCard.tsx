"use client";
import { useCart } from '@/context/CartContext';
import { EnquiryItemType, OrderItemType } from '@/lib/interfaces/OrderInterface';
import Image from 'next/image';
import { FaReply } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheckCircle } from 'react-icons/fa';

const EnquiryItemCard = ({ orderItem }: { orderItem: EnquiryItemType }) => {
  const { addToCart, addCustomCoilToCart } = useCart();

  const addItemsToCart = (() => {
    for (const item of orderItem.items) {
      item.product.quantity = item.quantity;
      addToCart(item.product);
    }
    for (const customItem of orderItem.customItems) {
      addCustomCoilToCart(customItem);
    }
    toast.success("Items added to cart!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      icon: <FaCheckCircle className="text-white" />,
      style: { background: '#22c55e', color: 'white' },
      toastId: 'enquiry-items-add'
    });
  });

  return (
    <div className='shadow-md rounded-md my-5 py-5  px-1 md:px-5 border-dashed border flex flex-row gap-5 items-center justify-center'>
      <div className=''>
        <div className='text-xs md:text-sm text-gray-400'>
          <h1>Order Id: {orderItem.enquiryId}</h1>
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
              <h1 className="text-xs md:text-xs font-gray-600 font-semibold">Part Code:  {item.product.sku || ''}</h1>
              <p className="text-xs md:text-sm text-gray-600 line-clamp-2 md:line-clamp-3 font-semibold">{item.product.description || ''}</p>
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
              <h1 className="text-sm md:text-lg font-semibold mb-3">{item.coilType} coil</h1>
              <div className="text-xs md:text-sm text-gray-600 grid grid-cols-1">
                <div className="grid grid-cols-2 gap-x-10 gap-y-3 md:gap-y-3">

                  <span className="font-semibold">Height:</span>
                  <span>{item.height}</span>

                  <span className="font-semibold">Length:</span>
                  <span>{item.length}</span>

                  <span className="font-semibold">Rows:</span>
                  <span>{item.rows}</span>

                  <span className="font-semibold">FPI:</span>
                  <span>{item.fpi}</span>

                  <span className="font-semibold">Endplate Type:</span>
                  <span>{item.endplateType}</span>

                  <span className="font-semibold">Circuit Type:</span>
                  <span>{item.circuitType}</span>

                  <span className="font-semibold">Number of Circuits:</span>
                  <span>{item.numberOfCircuits}</span>

                  <span className="font-semibold">Header Size:</span>
                  <span>{item.headerSize}</span>

                  <span className="font-semibold">Tube Type:</span>
                  <span>{item.tubeType}</span>

                  <span className="font-semibold">Pipe Type:</span>
                  <span>{item.pipeType}</span>

                  <span className="font-semibold">Fin Type:</span>
                  <span>{item.finType}</span>

                  <span className="font-semibold">Distributor Holes:</span>
                  <span>{item.distributorHoles}</span>

                  <span className="font-semibold">Distributor Holes Don't Know:</span>
                  <span>{item.distributorHolesDontKnow ? 'Yes' : 'No'}</span>

                  <span className="font-semibold">Inlet Connection:</span>
                  <span>{item.inletConnection}</span>

                  <span className="font-semibold">Inlet Connection Don't Know:</span>
                  <span>{item.inletConnectionDontKnow ? 'Yes' : 'No'}</span>

                  <span className="font-semibold">Quantity:</span>
                  <span>{item.quantity}</span>
                </div>
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

export default EnquiryItemCard