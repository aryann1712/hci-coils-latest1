"use client";

import { MdOutlineMailOutline } from "react-icons/md";
import { MdOutlineShoppingCart } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io5";
import { TiSocialFacebook } from "react-icons/ti";
import Link from "next/link";
import { useCart } from "@/context/CartContext";





type NavbarProps = {
  user?: {
    name?: string | null;  // Allow `null` to match NextAuth types
  };
};





const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const { cartItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [])



  return (
    <nav className="flex flex-col py-5 px-20 gap-y-5">
      {/* first row */}
      <div className="flex justify-between items-center">
        {/* mail */}
        <a
          href={`mailto:${process.env.NEXT_PUBLIC_CLIENT_EMAIL}`}
          className="flex items-center gap-3 text-blue-700 hover:underline"
        >
          <MdOutlineMailOutline className="h-5 w-5" />
          <h3>{process.env.NEXT_PUBLIC_CLIENT_EMAIL}</h3>
        </a>


        {/* card and order and social and login */}
        <div className="flex gap-3 text-gray-500 items-center">
          <a
            href={process.env.NEXT_PUBLIC_FACEBOOK_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <TiSocialFacebook className="h-8 w-8 cursor-pointer hover:text-white hover:bg-blue-500 rounded-full p-1" />
          </a>
          <a
            href={process.env.NEXT_PUBLIC_TWITTER_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <FaXTwitter className="h-7 w-7  cursor-pointer  hover:text-white hover:bg-cyan-500 rounded-full p-1" />
          </a>
          <a
            href={process.env.NEXT_PUBLIC_INSTAGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <IoLogoInstagram className="h-8 w-8  cursor-pointer  hover:text-white           hover:bg-[linear-gradient(45deg,_#f09433_0%,_#e6683c_25%,_#dc2743_50%,_#cc2366_75%,_#bc1888_100%)]  rounded-full p-1" />
          </a>
          <a
            href={process.env.NEXT_PUBLIC_LINKEDIN_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn className="h-7 w-7  cursor-pointer hover:text-white hover:bg-blue-500 rounded-full p-[2px]" />
          </a>

          <div className=" ml-5">
            <Link href={"/orders"}><h4 className="font-semibold hover:text-red-500">Orders</h4></Link>
          </div>


          <div className="relative mx-2">
            <Link href={"/cart"}>
              <MdOutlineShoppingCart className="font-bold text-[22px] cursor-pointer hover:text-red-500 relative" />
             {mounted &&  (cartItems.length > 0) && <p className="absolute -bottom-3 -right-3 rounded-full text-sm  text-center font-semibold text-white bg-red-500 h-5 px-[4px] pb-[10px]">{cartItems.length}</p>}
            </Link>
          </div>

          <div className="ml-2 px-4 py-2 bg-blue-700 text-white rounded-md text-sm font-semibold  cursor-pointer">
            <Link href={"/auth/signin"}><h4>Login</h4></Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
