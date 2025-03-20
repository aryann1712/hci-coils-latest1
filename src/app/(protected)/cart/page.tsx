"use client";
import CartProductCustomCoilCard from "@/components/CartCustomCoilCard";
import CartProductItemCard from "@/components/CartProductItemCard";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { CustomCoilItemType } from "@/lib/interfaces/CartInterface";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CgSmile } from "react-icons/cg";


const CartPage: React.FC = () => {
  const { cartItems, setAllToCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user } = useUser();



  const handlePurchase = () => {

    async function placeOrders() {
      if (user && (cartItems.items.length + cartItems.customCoils.length) > 0) {
        console.log("cartItems --> ", cartItems);

        const tempItems: {
          product: string;
          quantity: number;
        }[] = [];


        const customItems: CustomCoilItemType[] = [];

        cartItems.items.map((item) => {
          const temp = {
            product: item._id,
            quantity: item.quantity
          }
          tempItems.push(temp);
        })

        cartItems.customCoils.map((item) => {
          customItems.push(item);
        })

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify({
            user: user.userId,
            items: tempItems,
            customItems: customItems
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          alert(data.error || "Order failed");
          return;
        }
        console.log("Order placed successfully");
        setAllToCart({
          items: [],
          customCoils: []
        });
        router.push("/orders");
      }
    }

    if (!user) {
      console.log("no user found...try to sign in");
      // router.push("/auth/signin?redirect=/cart");
      router.push("/auth/signin");
    } else {
      placeOrders();

    }
  }



  const handleEnquire = () => {

    async function placeEnquires() {
      if (user && (cartItems.items.length + cartItems.customCoils.length) > 0) {
        console.log("cartItems --> ", cartItems);

        const tempItems: {
          product: string;
          quantity: number;
        }[] = [];


        const customItems: CustomCoilItemType[] = [];


        cartItems.items.map((item) => {
          const temp = {
            product: item._id,
            quantity: item.quantity
          }
          tempItems.push(temp);
        })


        cartItems.customCoils.map((item) => {
          customItems.push(item);
        });


        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/enquire/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: user.userId,
            items: tempItems,
            customItems: customItems
          }),
        });
        const data = await response.json();

        console.log("data ----", data);
        if (!response.ok) {
          alert(data.error || "Order failed");
          return;
        }
        console.log("Order placed successfully");
        setAllToCart({
          items: [],
          customCoils: []
        });
        router.push("/enquire");
      }
    }

    if (!user) {
      console.log("no user found...try to sign in");
      // router.push("/auth/signin?redirect=/cart");
      router.push("/auth/signin");
    } else {
      placeEnquires();

    }
  }



  useEffect(() => {
    setMounted(true);

    async function fetchData() {
      if (user && user.userId) {
        try {
          const data = await getCartFromAPI(user.userId);
          if (data) {
            console.log("data from the cart", data);
            const tempData = {
              items: data["items"],
              customCoils: data["customItems"]
            }
            setAllToCart(tempData);
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      }
    }

    // Only fetch data if user exists and userId is available
    if (user && user.userId) {
      fetchData();
    }

    // Adding the dependencies properly
  }, [user]);


  // Until the component is mounted, you can render a placeholder or nothing.
  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full px-2 md:px-0 md:max-w-[75%] mx-auto py-10 mb-10">
      <div className="mx-auto py-16 px-2 md:px-10 rounded-sm shadow-xl w-full space-y-10">
        <h1 className="text-blue-800 text-3xl font-semibold italic">Cart</h1>

        <div>
          {cartItems.items && cartItems.items.length > 0 && (
            cartItems.items.map((item, index) => (
              <CartProductItemCard key={index} cardData={item} />
            ))
          )}
        </div>
        <div>
          {cartItems.customCoils && cartItems.customCoils.length > 0 && (
            cartItems.customCoils.map((item, index) => (
              <CartProductCustomCoilCard key={index} cardData={item} />
            ))
          )}
        </div>

        {/* 3 Button - Place order or continue Shopping */}
        {mounted && (cartItems.items || cartItems.customCoils) && ((cartItems.items.length > 0) || (cartItems.customCoils.length > 0)) && <div className="flex flex-row justify-evenly">
          <Link href="/products">
            <div className="hidden md:block px-8 py-3 lg:w-[250px] rounded-md bg-red-400 hover:bg-red-500 text-center text-white font-semibold">Continue Shopping</div>
          </Link>
          <button className="px-8 py-3 lg:w-[250px] rounded-md bg-blue-400 hover:bg-blue-500 text-center text-white font-semibold" onClick={() => handleEnquire()}>Enquire Now</button>
          <button className=" px-8 py-3  lg:w-[250px] rounded-md bg-green-400 hover:bg-green-500 text-center text-white font-semibold" onClick={() => handlePurchase()}>Place Order</button>
        </div>}

        {mounted && cartItems.items && (cartItems.items.length === 0) && cartItems.customCoils && (cartItems.customCoils.length === 0) && (
          <div className='flex flex-col items-center justify-center gap-10'>
            <h3 className='text-gray-400 '>You don&apos;t have any item in cart</h3>
            <CgSmile className='text-8xl text-gray-400' />
            <Link href="/products">
              <div className="px-8 py-3 lg:w-[250px] rounded-md bg-red-400 hover:bg-red-500 text-center text-white font-semibold">Continue Shopping</div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;



async function getCartFromAPI(userId: string) {

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();

  if (!response.ok) {
    alert(data.error || "Sign in failed");
    return [];
  }

  return data.data;
}
