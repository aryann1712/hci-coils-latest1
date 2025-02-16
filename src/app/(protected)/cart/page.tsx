"use client";
// src/app/(protected)/cart/page.tsx


import CartProductItemCard from "@/components/CartProductItemCard";
import { useCart } from "@/context/CartContext";
import { CartItemType } from "@/lib/interfaces/CartInterface";
import { useEffect, useState } from "react";




export default function CartPage() {
  const { addToCart, cartItems, removeFromCart } = useCart();
  // const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  // On mount, load cart from localStorage or global store
  useEffect(() => {
    // const cartData = localStorage.getItem("cart");
    // if (cartData) {
    //   setCartItems(JSON.parse(cartData));
    // }
  }, []);

  const handleSubmitEnquiry = () => {
    // 1. Generate unique enquiry ID
    // 2. Call an API route to send email to admin & user
    // 3. Clear cart or keep it?
  };

  return (
    <div className=" max-w-[75%] mx-auto py-10">
      <div className="mx-auto py-16 px-10 rounded-sm shadow-xl w-full space-y-10">
        <h1 className="text-blue-800 text-3xl font-semibold italic">Cart</h1>
        
        {/*Cart Item List  */}
        <div>
          {cartItems.map((item, index) => <CartProductItemCard cardData={item}/>)}

        </div>

        {/* 2 Button - Place order or continue Shopping */}
        <div className="flex flex-row">


        </div>


      </div>

    </div>
  );
}




// let cartDatas: CartItemType[] = [
//   { 
//     productId: 1, 
//     productName: "Bmw x5",  
//     productImage: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", 
//     productDesc: "Lorem ispum dolor a4 kfasdhbkjcbjkasb  kascjnbkjasb klacshkljcnsakjcnsakjnbacskj",
//     quantity: 500 
//     },
//   { 
//     productId: 2, 
//     productName: "Bmw x5",  
//     productImage: "https://stimg.cardekho.com/images/carexteriorimages/930x620/Maruti/Dzire/11387/1731318279714/front-left-side-47.jpg", 
//     productDesc: "Lorem ispum dolor a4 kfasdhbkjcbjkasb  kascjnbkjasb klacshkljcnsakjcnsakjnbacskj",
//     quantity: 10 
//   },
//   { 
//     productId: 3, 
//     productName: "Bmw x5",  
//     productImage: "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", 
//     productDesc: "Lorem ispum dolor a4 kfasdhbkjcbjkasb  kascjnbkjasb klacshkljcnsakjcnsakjnbacskj",
//     quantity: 300 
//   },
//   { 
//     productId: 4, 
//     productName: "Bmw x5",  
//     productImage: "https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", 
//     productDesc: "Lorem ispum dolor a4 kfasdhbkjcbjkasb  kascjnbkjasb klacshkljcnsakjcnsakjnbacskj",
//     quantity: 120 
//   },
//   { 
//     productId: 5, 
//     productName: "Bmw x5",  
//     productImage: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg", 
//     productDesc: "Lorem ispum dolor a4 kfasdhbkjcbjkasb  kascjnbkjasb klacshkljcnsakjcnsakjnbacskj",
//     quantity: 200 
//   },
// ];
