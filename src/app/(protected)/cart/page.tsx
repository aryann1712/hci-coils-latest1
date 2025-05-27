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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const CartPage: React.FC = () => {
  const { cartItems, setAllToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const handlePurchase = () => {
    if (!user) {
      toast.error("Please sign in to continue", {
        position: "top-right",
        autoClose: 3000,
        icon: <FaExclamationCircle className="text-white" />,
        style: { background: '#ef4444', color: 'white' },
        toastId: 'cart-action'
      });
      router.push("/auth/signin");
      return;
    }
  
    setLoading(true);
  
    async function placeOrders() {
      try {
        if ((cartItems.items.length + cartItems.customCoils.length) > 0) {
          const tempItems = cartItems.items.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          }));
  
          const customItems: CustomCoilItemType[] = [...cartItems.customCoils];
  
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${user?.token}`,
            },
            body: JSON.stringify({
              user: user?.userId,
              items: tempItems,
              customItems: customItems,
            }),
          });
  
          const data = await response.json();
  
          if (!response.ok) {
            toast.error(data.error || "Failed to place order", {
              position: "top-right",
              autoClose: 3000,
              icon: <FaExclamationCircle className="text-white" />,
              style: { background: '#ef4444', color: 'white' },
              toastId: 'cart-action'
            });
            return;
          }
  
          toast.success("Order placed successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            icon: <FaCheckCircle className="text-white" />,
            style: { background: '#22c55e', color: 'white' },
            toastId: 'cart-action'
          });
          setAllToCart({ items: [], customCoils: [] });
          router.push("/orders");
        }
      } catch (error) {
        console.error("Order error:", error);
        toast.error("Failed to place order", {
          position: "top-right",
          autoClose: 3000,
          icon: <FaExclamationCircle className="text-white" />,
          style: { background: '#ef4444', color: 'white' },
          toastId: 'cart-action'
        });
      } finally {
        setLoading(false);
      }
    }
  
    placeOrders();
  };
  


  const handleEnquire = () => {
    if (!user) {
      toast.error("Please sign in to continue", {
        position: "top-right",
        autoClose: 3000,
        icon: <FaExclamationCircle className="text-white" />,
        style: { background: '#ef4444', color: 'white' },
        toastId: 'cart-action'
      });
      router.push("/auth/signin");
      return;
    }
  
    setLoading(true);
  
    async function placeEnquires() {
      try {
        if ((cartItems.items.length + cartItems.customCoils.length) > 0) {
          const tempItems = cartItems.items.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          }));
  
          const customItems: CustomCoilItemType[] = [...cartItems.customCoils];
  
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/enquire/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user: user?.userId,
              items: tempItems,
              customItems: customItems,
            }),
          });
  
          const data = await response.json();
  
          if (!response.ok) {
            toast.error(data.error || "Failed to send enquiry", {
              position: "top-right",
              autoClose: 3000,
              icon: <FaExclamationCircle className="text-white" />,
              style: { background: '#ef4444', color: 'white' },
              toastId: 'cart-action'
            });
            return;
          }
  
          toast.success("Enquiry sent successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            icon: <FaCheckCircle className="text-white" />,
            style: { background: '#22c55e', color: 'white' },
            toastId: 'cart-action'
          });
          setAllToCart({ items: [], customCoils: [] });
          router.push("/enquire");
        }
      } catch (error) {
        console.error("Enquiry error:", error);
        toast.error("Failed to send enquiry", {
          position: "top-right",
          autoClose: 3000,
          icon: <FaExclamationCircle className="text-white" />,
          style: { background: '#ef4444', color: 'white' },
          toastId: 'cart-action'
        });
      } finally {
        setLoading(false);
      }
    }
  
    placeEnquires();
  };
  

  useEffect(() => {
    setMounted(true);

    async function fetchAndMergeCart() {
      if (user && user.userId) {
        try {
          const serverCart = await getCartFromAPI(user.userId);

          // Get local cart from localStorage
          const localCartStr = localStorage.getItem("cartItems");
          const localCart = localCartStr ? JSON.parse(localCartStr) : { items: [], customCoils: [] };

          // Merge logic (simple version: combine arrays, remove duplicates based on _id)
          const mergedItems = [...serverCart.items];

          localCart.items.forEach((localItem: any) => {
            const index = mergedItems.findIndex((item: any) => item._id === localItem._id);
            if (index === -1) {
              mergedItems.push(localItem);
            }
          });

          const mergedCustomCoils = [...serverCart.customItems];

          localCart.customCoils.forEach((localCoil: any) => {
            const index = mergedCustomCoils.findIndex((item: any) => item.name === localCoil.name); // Use a better unique field if available
            if (index === -1) {
              mergedCustomCoils.push(localCoil);
            }
          });

          const mergedCart = {
            items: mergedItems,
            customCoils: mergedCustomCoils
          };

          // Optionally update server with merged cart here

          // Set merged cart to context + localStorage
          setAllToCart(mergedCart);

        } catch (error) {
          console.error("Error merging cart:", error);
        }
      }
    }

    if (user && user.userId) {
      fetchAndMergeCart();
    }
  }, [user]);



  // Until the component is mounted, you can render a placeholder or nothing.
  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full px-2 md:px-0 md:max-w-[75%] mx-auto py-10 mb-10">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

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
