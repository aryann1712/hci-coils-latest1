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
import { toast } from "react-hot-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  imageUrl: string;
  // Add other fields as needed
}

interface CustomCoilItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  specifications: {
    pipeType: string;
    pipeSize: string;
    circuit: string;
    endplate: string;
    // Add other specifications as needed
  };
}

const CartPage: React.FC = () => {
  const { cartItems, setAllToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const handlePurchase = () => {
    if (!user) {
      console.log("No user found... try to sign in");
      router.push("/auth/signin");
      return;
    }
  
    setLoading(true); // Show spinner
  
    async function placeOrders() {
      try {
        if ((cartItems.items.length + cartItems.customCoils.length) > 0) {
          console.log("cartItems --> ", cartItems);
  
          const tempItems = cartItems.items.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          }));
  
          const customItems: CustomCoilItemType[] = [...cartItems.customCoils];
  
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
          const token = localStorage.getItem('token');
  
          if (!token) {
            toast.error("Please log in again");
            setLoading(false);
            return;
          }

          if (!baseUrl) {
            toast.error("API URL not configured");
            setLoading(false);
            return;
          }

          // Check if server is available by trying to fetch the orders endpoint
          try {
            const serverCheck = await fetch(`${baseUrl}/api/orders`, {
              method: "GET",
              headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
              },
            });
            
            if (!serverCheck.ok && serverCheck.status !== 401) {
              throw new Error("Server is not responding");
            }
          } catch (serverError) {
            console.error("Server check failed:", serverError);
            toast.error("Unable to connect to server. Please check if the server is running at " + baseUrl);
            setLoading(false);
            return;
          }
  
          try {
            const response = await fetch(`${baseUrl}/api/orders`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
              },
              credentials: 'include',
              body: JSON.stringify({
                user: user?.userId,
                items: tempItems,
                customItems: customItems,
              }),
            });
  
            const responseText = await response.text();
            console.log('Raw response:', responseText);
  
            if (!response.ok) {
              let errorMessage = 'Failed to place order';
              try {
                const errorJson = JSON.parse(responseText);
                errorMessage = errorJson.error || errorMessage;
              } catch (e) {
                console.error('Failed to parse error response:', e);
              }
              throw new Error(errorMessage);
            }
  
            let data;
            try {
              data = JSON.parse(responseText);
            } catch (parseError) {
              console.error('Failed to parse response:', parseError);
              throw new Error('Invalid response from server');
            }
  
            if (!data || !data.success) {
              throw new Error(data.error || 'Failed to place order');
            }
  
            console.log("Order placed successfully");
            setAllToCart({ items: [], customCoils: [] });
            router.push("/orders");
          } catch (fetchError: any) {
            console.error("Network error:", fetchError);
            if (fetchError.message === "Failed to fetch") {
              toast.error("Unable to connect to server. Please check your internet connection and try again.");
            } else {
              toast.error(fetchError.message || "Network error. Please try again.");
            }
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to place order';
        console.error("Order error:", errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  
    placeOrders();
  };
  


  const handleEnquire = () => {
    if (!user) {
      console.log("No user found... try to sign in");
      router.push("/auth/signin");
      return;
    }
  
    setLoading(true); // Show spinner
  
    async function placeEnquires() {
      try {
        if ((cartItems.items.length + cartItems.customCoils.length) > 0) {
          console.log("cartItems --> ", cartItems);
  
          const tempItems = cartItems.items.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          }));
  
          const customItems: CustomCoilItemType[] = [...cartItems.customCoils];
  
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
          const token = localStorage.getItem('token');
  
          if (!token) {
            toast.error("Please log in again");
            return;
          }
  
          const response = await fetch(`${baseUrl}/api/enquire`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify({
              user: user?.userId,
              items: tempItems,
              customItems: customItems,
            }),
          });
  
          const responseText = await response.text();
          console.log('Raw response:', responseText);
  
          if (!response.ok) {
            let errorMessage = 'Failed to place enquiry';
            try {
              const errorJson = JSON.parse(responseText);
              errorMessage = errorJson.error || errorMessage;
            } catch (e) {
              console.error('Failed to parse error response:', e);
            }
            throw new Error(errorMessage);
          }
  
          let data;
          try {
            data = JSON.parse(responseText);
          } catch (parseError) {
            console.error('Failed to parse response:', parseError);
            throw new Error('Invalid response from server');
          }
  
          if (!data || !data.success) {
            throw new Error(data.error || 'Failed to place enquiry');
          }
  
          console.log("Enquiry placed successfully");
          setAllToCart({ items: [], customCoils: [] });
          router.push("/enquire");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to place enquiry';
        console.error("Enquiry error:", errorMessage);
        toast.error(errorMessage);
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
          const serverCart = await getCartFromAPI(user.userId, user);

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



async function getCartFromAPI(userId: string, user: any) {
  if (!user?.token) {
    console.error("No authentication token found");
    return { items: [], customItems: [] };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/${userId}`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    alert("Failed to fetch cart. Please try again.");
    return { items: [], customItems: [] };
  }
}
