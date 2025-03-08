"use client";
import CartProductItemCard from "@/components/CartProductItemCard";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
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
      if (user && cartItems.length > 0) {
        console.log("cartItems --> ", cartItems);

        const tempItems: {
          product: string;
          quantity: number;
      }[] = [];

        cartItems.map((item) => {
          const temp = {
            product: item._id,
            quantity: item.quantity
          }
          tempItems.push(temp);
        })

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify({
            user: user.userId,
            items: tempItems
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          alert(data.error || "Order failed");
          return;
        }
        console.log("Order placed successfully");
        setAllToCart([]);
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
      if (user && cartItems.length > 0) {
        console.log("cartItems --> ", cartItems);

        const  tempItems: {
          product: string;
          quantity: number;
      }[] = [];

        cartItems.map((item) => {
          const temp = {
            product: item._id,
            quantity: item.quantity
          }
          tempItems.push(temp);
        })

        console.log("tempItems", tempItems);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/enquire/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: user.userId,
            items: tempItems
          }),
        });
        const data = await response.json();

        console.log("data ----", data);
        if (!response.ok) {
          alert(data.error || "Order failed");
          return;
        }
        console.log("Order placed successfully");
        setAllToCart([]);
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
    // console.log("user", user);

    async function fetchData() {
      if (user && user.userId) {
        const data = await getCartFromAPI(user.userId);
        if (data) {
          setAllToCart(data);
        }
      }
    }
    fetchData();
  }, [user, setAllToCart]);

  // Until the component is mounted, you can render a placeholder or nothing.
  if (!mounted) {
    return null;
  }

  return (
    <div className=" max-w-[75%] mx-auto py-10 mb-10">
      <div className="mx-auto py-16 px-10 rounded-sm shadow-xl w-full space-y-10">
        <h1 className="text-blue-800 text-3xl font-semibold italic">Cart</h1>

        <div>
          {cartItems.length > 0 && (
            cartItems.map((item, index) => (
              <CartProductItemCard key={index} cardData={item} />
            ))
          )}
        </div>

        {/* 3 Button - Place order or continue Shopping */}
        {mounted && (cartItems.length > 0) && <div className="flex flex-row justify-evenly">
          <Link href="/products">
            <div className="px-8 py-3 lg:w-[250px] rounded-md bg-red-400 hover:bg-red-500 text-center text-white font-semibold">Continue Shopping</div>
          </Link>
          <button className="px-8 py-3 lg:w-[250px] rounded-md bg-blue-400 hover:bg-blue-500 text-center text-white font-semibold" onClick={() => handleEnquire()}>Enquire Now</button>
          <button className="px-8 py-3  lg:w-[250px] rounded-md bg-green-400 hover:bg-green-500 text-center text-white font-semibold" onClick={() => handlePurchase()}>Place Order</button>
        </div>}

        {mounted && (cartItems.length === 0) && (
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
