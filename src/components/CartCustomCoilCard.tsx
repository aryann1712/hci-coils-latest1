"use client";
import { useCart } from "@/context/CartContext";
import { CartItemType, CustomCoilItemType } from "@/lib/interfaces/CartInterface";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { MdDelete } from "react-icons/md";

interface CartProductItemCardProps {
    cardData: CustomCoilItemType;
}

const CartProductCustomCoilCard: React.FC<CartProductItemCardProps> = ({
    cardData,

}) => {
    const { addCustomCoilToCart, removeCustomCoilFromCart } = useCart();
    const router = useRouter();

    /**
     * Called when user manually types a new quantity in the input.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQty = parseInt(e.target.value, 10);
        if (newQty >= 1) {
            cardData.quantity = newQty;
            addCustomCoilToCart(cardData);
        }
    };



    return (
        <div className="grid grid-cols-4 items-center py-5 md:px-5 border-b">
            {/* Image */}
            <div>
                <Image
                    src={"/custom-coil-info1.png"}
                    alt="custom coil"
                    width={1000}
                    height={1000}
                    className="h-[70px] w-[100px] md:h-[200px] md:w-[350px] rounded-md object-cover cursor-pointer"
                //   onClick={() => router.push(`/products/${cardData._id}`)}
                />
            </div>

            {/* Name and Description */}
            <div className="col-span-2 flex flex-col px-4 cursor-pointer h-full  md:gap-y-5 justify-center"
            //   onClick={() => router.push(`/products/${cardData._id}`)}
            >
                <h1 className="text-sm md:text-lg font-semibold">{cardData.coilType}</h1>
                <div className="text-xs md:text-sm text-gray-600 grid grid-cols-1">
                    <p><span className="font-semibold mr-2">coilType:</span> {cardData.coilType}</p>
                    <p><span className="font-semibold  mr-2">height:</span> {cardData.height}</p>
                    <p><span className="font-semibold mr-2">length:</span> {cardData.length}</p>
                    <p><span className="font-semibold mr-2">rows:</span> {cardData.rows}</p>
                    <p><span className="font-semibold mr-2">fpi:</span> {cardData.fpi}</p>
                    <p><span className="font-semibold mr-2">endplateType:</span> {cardData.endplateType}</p>
                    <p><span className="font-semibold mr-2">circuitType:</span> {cardData.circuitType}</p>
                    <p><span className="font-semibold mr-2">numberOfCircuits:</span> {cardData.numberOfCircuits}</p>
                    <p><span className="font-semibold mr-2">headerSize:</span> {cardData.headerSize}</p>
                    <p><span className="font-semibold mr-2">tubeType:</span> {cardData.tubeType}</p>
                    <p><span className="font-semibold mr-2">pipeType:</span> {cardData.pipeType}</p>
                    <p><span className="font-semibold mr-2">finType:</span> {cardData.finType}</p>
                    <p><span className="font-semibold mr-2">distributorHoles:</span> {cardData.distributorHoles}</p>
                    <p><span className="font-semibold mr-2">distributorHolesDontKnow:</span> {cardData.distributorHolesDontKnow ? "Yes" : "No"}</p>
                    <p><span className="font-semibold mr-2">inletConnection:</span> {cardData.inletConnection}</p>
                    <p><span className="font-semibold mr-2">inletConnectionDontKnow:</span> {cardData.inletConnectionDontKnow ? "Yes" : "No"}</p>
                    <p><span className="font-semibold mr-2">quantity:</span> {cardData.quantity}</p>
                </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8 md:items-end">
                <div className="flex flex-col space-y-2 items-center justify-center">
                    <h3 className="text-xs md:text-sm font-semibold text-gray-500">Qty.</h3>
                    <div className="flex items-center justify-end gap-2">
                        {/* Decrement Button */}
                        <button
                            onClick={() => {
                                cardData.quantity--;
                                return addCustomCoilToCart(cardData);
                            }}
                            disabled={cardData.quantity <= 1}
                            className={`w-4 h-4 md:w-8 md:h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:bg-gray-100 transition`}
                        >
                            –
                        </button>

                        {/* Editable Quantity Input */}
                        <input
                            type="text"
                            className="w-6 md:w-12 text-xs md:text-base text-center border border-gray-300 rounded appearance-none outline-none focus:ring-2 focus:ring-blue-500"
                            value={cardData.quantity}
                            onChange={handleChange}
                        />

                        {/* Increment Button */}
                        <button
                            onClick={() => {
                                cardData.quantity++;
                                return addCustomCoilToCart(cardData);
                            }}
                            className="w-4 h-4 md:w-8 md:h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                        >
                            +
                        </button>
                    </div>
                </div>
                <MdDelete className="text-2xl mb-1 text-gray-500 hover:text-black" onClick={() => removeCustomCoilFromCart(cardData)} />
            </div>
        </div>
    );
};

export default CartProductCustomCoilCard;
