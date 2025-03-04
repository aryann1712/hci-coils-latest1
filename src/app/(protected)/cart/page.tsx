"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import CartProductItemCard from "@/components/CartProductItemCard";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { CgSmile } from "react-icons/cg";
import { CartItemType } from "@/lib/interfaces/CartInterface";


const CartPage: React.FC = () => {
  const { cartItems, setAllToCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user } = useUser();



  const handlePurchase = () => {
    if (!user) {
      console.log("no user found...try to sign in");
      //redirect to login page
      // router.push("/auth/signin?redirect=/cart");
      router.push("/auth/signin");
    } else {
      console.log("User found:", user);
      console.log("Cart items:", cartItems);
    }
  }

  const handleEnquireNow = async () => {
    if (user) {

    } else {
      console.log("no user found...try to sign in");
      // Redirect to sign-in page if not logged in
      router.push("/auth/signin");
    }
  };

  useEffect(() => {
    setMounted(true);
    console.log("user", user);
  
    async function fetchData() {
      if (user && user.userId) {
        const data  = await getCartFromAPI(user.userId);
        if(data) {
          setAllToCart(data);
        }
      }
    }
    fetchData();
  }, [user]);

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
              console.log("item in cart", item),
              <CartProductItemCard key={index} cardData={item} />
            ))
          )}
        </div>

        {/* 3 Button - Place order or continue Shopping */}
        {mounted && (cartItems.length > 0) && <div className="flex flex-row justify-evenly">
          <Link href="/products">
            <div className="px-8 py-3 lg:w-[250px] rounded-md bg-red-400 hover:bg-red-500 text-center text-white font-semibold">Continue Shopping</div>
          </Link>
          <button className="px-8 py-3 lg:w-[250px] rounded-md bg-blue-400 hover:bg-blue-500 text-center text-white font-semibold" onClick={() => handleEnquireNow()}>Enquire Now</button>
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



async function getCartFromAPI(userId: any) {

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
