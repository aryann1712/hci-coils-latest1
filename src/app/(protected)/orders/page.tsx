"use client";


import OrderItemCard from '@/components/OrderItemCard';
import { useUser } from '@/context/UserContext';
import { OrderItemType } from '@/lib/interfaces/OrderInterface';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CgSmile } from "react-icons/cg";


const OrderPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [userOrders, setUserOrders] = useState<OrderItemType[]>([]);

    useEffect(() => {
        setMounted(true);
        async function fetchData() {
            const data = await getUserOrder();
            setUserOrders(data);}

        if (!user) {
            router.replace("/");
            return;
        } else {
            fetchData();
        }

    }, []);

    if (!mounted) {
        return null;
    }



    async function getUserOrder(): Promise<OrderItemType[]> {
        return [
            {
                orderId: "123",
                orderDate: "2024-03-17",
                products: [
                    {
                        productId: "1",
                        productDesc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eveniet, impedit. Neque esse nesciunt quod asperiores doloribus officia id blanditiis minus molestiae saepe facilis repellendus corporis, molestias temporibus error doloremque nobis.",
                        productImage: "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                        productName: "A1",
                        quantity: 1
                    },
                    {
                        productId: "2",
                        productDesc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eveniet, impedit. Neque esse nesciunt quod asperiores doloribus officia id blanditiis minus molestiae saepe facilis repellendus corporis, molestias temporibus error doloremque nobis.",
                        productImage: "https://images.pexels.com/photos/248747/pexels-photo-248747.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                        productName: "A1",
                        quantity: 1
                    },
                    {
                        productId: "3",
                        productDesc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eveniet, impedit. Neque esse nesciunt quod asperiores doloribus officia id blanditiis minus molestiae saepe facilis repellendus corporis, molestias temporibus error doloremque nobis.",
                        productImage: "https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                        productName: "A1",
                        quantity: 1
                    },
                ],
                address: "vasundhara",
                gstNumber: "1234567890",
                phone: "9315045029",
                userId: "1",
                name: "Rounak"
            },
            {
                orderId: "1232",
                orderDate: "2025-02-18",
                products: [
                    {
                        productId: "1",
                        productDesc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eveniet, impedit. Neque esse nesciunt quod asperiores doloribus officia id blanditiis minus molestiae saepe facilis repellendus corporis, molestias temporibus error doloremque nobis.",
                        productImage: "https://images.pexels.com/photos/13861/IMG_3496bfree.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                        productName: "A1",
                        quantity: 1
                    },
                    {
                        productId: "2",
                        productDesc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eveniet, impedit. Neque esse nesciunt quod asperiores doloribus officia id blanditiis minus molestiae saepe facilis repellendus corporis, molestias temporibus error doloremque nobis.",
                        productImage: "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                        productName: "A1",
                        quantity: 1
                    },
                    {
                        productId: "3",
                        productDesc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eveniet, impedit. Neque esse nesciunt quod asperiores doloribus officia id blanditiis minus molestiae saepe facilis repellendus corporis, molestias temporibus error doloremque nobis.",
                        productImage: "https://images.pexels.com/photos/909907/pexels-photo-909907.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                        productName: "A1",
                        quantity: 1
                    },
                ],
                address: "vasundhara",
                gstNumber: "1234567890",
                phone: "9315045029",
                userId: "1",
                name: "Rounak"
            },
            {
                orderId: "1233",
                orderDate: "2025-02-21",
                products: [
                    {
                        productId: "1",
                        productDesc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eveniet, impedit. Neque esse nesciunt quod asperiores doloribus officia id blanditiis minus molestiae saepe facilis repellendus corporis, molestias temporibus error doloremque nobis.",
                        productImage: "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                        productName: "A1",
                        quantity: 1
                    },
                    {
                        productId: "2",
                        productDesc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eveniet, impedit. Neque esse nesciunt quod asperiores doloribus officia id blanditiis minus molestiae saepe facilis repellendus corporis, molestias temporibus error doloremque nobis.",
                        productImage: "https://images.pexels.com/photos/248747/pexels-photo-248747.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                        productName: "A1",
                        quantity: 1
                    },
                    {
                        productId: "3",
                        productDesc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eveniet, impedit. Neque esse nesciunt quod asperiores doloribus officia id blanditiis minus molestiae saepe facilis repellendus corporis, molestias temporibus error doloremque nobis.",
                        productImage: "https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                        productName: "A1",
                        quantity: 1
                    },
                ],
                address: "vasundhara",
                gstNumber: "1234567890",
                phone: "9315045029",
                userId: "1",
                name: "Rounak"
            },
        ]
    }

    return (
        <div className=" max-w-[75%] mx-auto py-10 mb-10">
            <div className="mx-auto py-16 px-10 rounded-sm shadow-xl w-full space-y-10">
                <h1 className="text-blue-800 text-3xl font-semibold italic">Orders</h1>

                <div>
                    {
                        (userOrders.length === 0) ? (
                            <div className='flex flex-col items-center justify-center gap-10'>
                                <h3 className='text-gray-400 '>You don't have any previous order</h3>
                                <CgSmile className='text-8xl text-gray-400' />
                                <Link href="/products">
                                    <div className="px-8 py-3 lg:w-[250px] rounded-md bg-red-400 hover:bg-red-500 text-center text-white font-semibold">Continue Shopping</div>
                                </Link>
                            </div>
                        ) : (
                            // add here the logic of order Card
                            <div className=''>
                                {userOrders.map((orderData, index) => <OrderItemCard key={index} orderItem={orderData} />)}
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}

export default OrderPage