"use client";

import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoInstagram, IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlineMailOutline, MdOutlineShoppingCart } from "react-icons/md";
import { TiSocialFacebook } from "react-icons/ti";

const Navbar = () => {
  const { cartItems } = useCart();
  const { user, signOut } = useUser();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  // Add null checks to prevent the "cartItems.items is undefined" error
  const totalQuantity = (cartItems?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0) + 
                       (cartItems?.customCoils?.reduce((acc, item) => acc + item.quantity, 0) || 0);


                       console.log("navbar se cart items", cartItems.items)
                       console.log("navbar se custom items", cartItems.customCoils)

  useEffect(() => {
    setMounted(true);
  }, [user, mounted]);

  const handleSignOut = () => {
    if (user) {
      signOut();
    } else {
      console.log("user doesnt exist...so no sign out");
    }
  };

  return (
    <nav className="flex flex-col py-5 px-5 lg:px-20 gap-y-5 ">
      {/* first row */}
      <div className="flex justify-between items-center">
        {/* mail */}
        <a
          href={`mailto:${process.env.NEXT_PUBLIC_CLIENT_EMAIL}`}
          className="hidden md:flex items-center gap-3 text-blue-700 hover:underline"
        >
          <MdOutlineMailOutline className="h-5 w-5" />
          <h3>{process.env.NEXT_PUBLIC_CLIENT_EMAIL}</h3>
        </a>

        <Link href="/" className="block md:hidden">
          <Image src={"/logo.png"} height={100} width={100} alt="logo" className="cursor-pointer" />
        </Link>

        {/* card and order and social and login */}
        <div className="flex gap-3 text-gray-500 items-center">
          <a
            className="hidden md:block"
            href={process.env.NEXT_PUBLIC_FACEBOOK_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <TiSocialFacebook className="h-8 w-8 cursor-pointer hover:text-white hover:bg-blue-500 rounded-full p-1" />
          </a>
          <a
            className="hidden md:block"
            href={process.env.NEXT_PUBLIC_TWITTER_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <FaXTwitter className="h-7 w-7  cursor-pointer  hover:text-white hover:bg-cyan-500 rounded-full p-1" />
          </a>
          <a
            className="hidden md:block"
            href={process.env.NEXT_PUBLIC_INSTAGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <IoLogoInstagram className="h-8 w-8  cursor-pointer  hover:text-white           hover:bg-[linear-gradient(45deg,_#f09433_0%,_#e6683c_25%,_#dc2743_50%,_#cc2366_75%,_#bc1888_100%)]  rounded-full p-1" />
          </a>
          <a
            className="hidden md:block"
            href={process.env.NEXT_PUBLIC_LINKEDIN_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn className="h-7 w-7  cursor-pointer hover:text-white hover:bg-blue-500 rounded-full p-[2px]" />
          </a>

          {mounted && user?.role == "admin" && (
            <div className="hidden md:block ml-5">
              <Link href={"/manage-customer"}>
                <h4 className="font-semibold hover:text-red-500">Manage Customer</h4>
              </Link>
            </div>
          )}

          {mounted && user?.role == "admin" && (
            <div className="hidden md:block ml-5">
              <Link href={"/manage-employee"}>
                <h4 className="font-semibold hover:text-red-500">Manage Employee</h4>
              </Link>
            </div>
          )}

          {mounted && (user?.role == "admin" || user?.role == "manager") && (
            <div className="hidden md:block  ml-5">
              <Link href={"/all-orders"}>
                <h4 className="font-semibold hover:text-red-500">All Orders</h4>
              </Link>
            </div>
          )}

          {mounted && (user?.role == "admin" || user?.role == "manager") && (
            <div className="hidden md:block  ml-5">
              <Link href={"/all-enquires"}>
                <h4 className="font-semibold hover:text-red-500">All Enquires</h4>
              </Link>
            </div>
          )}

          {mounted && (user?.role == "admin" || user?.role == "manager") && (
            <div className="hidden md:block  ml-5">
              <Link href={"/admin-products"}>
                <h4 className="font-semibold hover:text-red-500">Add Products</h4>
              </Link>
            </div>
          )}

          {mounted && user && user?.role != "admin" && user?.role != "manager" && (
            <div className=" hidden md:block ml-5">
              <Link href={"/enquire"}>
                <h4 className="font-semibold hover:text-red-500">Enquires</h4>
              </Link>
            </div>
          )}

          {mounted && user && user?.role != "admin" && user?.role != "manager" && (
            <div className="hidden md:block  ml-5">
              <Link href={"/orders"}>
                <h4 className="font-semibold hover:text-red-500">Orders</h4>
              </Link>
            </div>
          )}

          {(!user || (user?.role != "admin" && user?.role != "manager")) && (
            <div className="relative mx-2">
              <Link href={"/cart"}>
                <MdOutlineShoppingCart className="font-bold text-[26px] cursor-pointer hover:text-red-500 relative" />
                {mounted && cartItems?.items && cartItems.items.length > 0 && (
                  <p className="absolute -bottom-3 -right-3 rounded-full text-sm text-center font-semibold text-white bg-red-500 h-5 px-[4px] pb-[10px]">
                    {totalQuantity}
                  </p>
                )}
              </Link>
            </div>
          )}

          <div
            className="flex md:hidden gap-2 items-center cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              // Cross Icon
              <div className="flex flex-col justify-center items-center transform z-[100]">
                <span className="block w-6 h-[2px] bg-black ms-6 rotate-45 origin-left"></span>
                <span className="block w-6 h-[2px] bg-black ms-2 -rotate-45 origin-right"></span>
              </div>
            ) : (
              // Hamburger Icon
              <div className="flex flex-col justify-center items-center gap-1">
                <span className="block w-6 h-[2px] bg-black"></span>
                <span className="block w-6 h-[2px] bg-black"></span>
                <span className="block w-6 h-[2px] bg-black"></span>
              </div>
            )}
          </div>

          {mounted && user && user?.role != "admin" && (
            <div className="hidden md:block">
              <Link href={"/profile"}>
                <IoPersonCircleOutline className="font-bold text-[30px] cursor-pointer hover:text-red-500 relative" />
              </Link>
            </div>
          )}

          {mounted && !user && (
            <div className="hidden md:block ml-2 px-4 py-2 bg-blue-700 text-white rounded-md text-sm font-semibold cursor-pointer">
              <Link href={"/auth/signin"}>
                <h4>Login</h4>
              </Link>
            </div>
          )}

          {mounted && user && (
            <div
              className="hidden md:block ml-2 px-4 py-2 bg-blue-700 text-white rounded-md text-sm font-semibold cursor-pointer"
              onClick={() => handleSignOut()}
            >
              <h4>Logout</h4>
            </div>
          )}

          {isOpen && (
            <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden bg-gray-300 bg-opacity-100 flex flex-col items-center justify-center gap-10 z-[90] text-white text-lg">
              {mounted && user?.role == "admin" && (
                <div className="ml-5">
                  <h4
                    className="font-semibold hover:text-red-500"
                    onClick={() => {
                      setIsOpen(false);
                      return router.push("/manage-customer");
                    }}
                  >
                    Manage Customer
                  </h4>
                </div>
              )}

              {mounted && user?.role == "admin" && (
                <div className="ml-5">
                  <h4
                    className="font-semibold hover:text-red-500"
                    onClick={() => {
                      setIsOpen(false);
                      return router.push("/manage-employee");
                    }}
                  >
                    Manage Employee
                  </h4>
                </div>
              )}

              {mounted && (user?.role == "admin" || user?.role == "manager") && (
                <div className="ml-5">
                  <h4
                    className="font-semibold hover:text-red-500"
                    onClick={() => {
                      setIsOpen(false);
                      return router.push("/all-orders");
                    }}
                  >
                    All Orders
                  </h4>
                </div>
              )}

              {mounted && (user?.role == "admin" || user?.role == "manager") && (
                <div className="ml-5">
                  <h4
                    className="font-semibold hover:text-red-500"
                    onClick={() => {
                      setIsOpen(false);
                      return router.push("/all-enquires");
                    }}
                  >
                    All Enquires
                  </h4>
                </div>
              )}

              {mounted && (user?.role == "admin" || user?.role == "manager") && (
                <div className="ml-5">
                  <h4
                    className="font-semibold hover:text-red-500"
                    onClick={() => {
                      setIsOpen(false);
                      return router.push("/admin-products");
                    }}
                  >
                    Add Products
                  </h4>
                </div>
              )}

              {mounted && user && user?.role != "admin" && user?.role != "manager" && (
                <div className="ml-5">
                  <h4
                    className="font-semibold hover:text-red-500"
                    onClick={() => {
                      setIsOpen(false);
                      return router.push("/enquire");
                    }}
                  >
                    Enquires
                  </h4>
                </div>
              )}

              {mounted && user && user?.role != "admin" && user?.role != "manager" && (
                <div className="ml-5">
                  <h4
                    className="font-semibold hover:text-red-500"
                    onClick={() => {
                      setIsOpen(false);
                      return router.push("/orders");
                    }}
                  >
                    Orders
                  </h4>
                </div>
              )}

              {mounted && user && user?.role != "admin" && (
                <div className="ml-5">
                  <h4
                    className="font-semibold hover:text-red-500"
                    onClick={() => {
                      setIsOpen(false);
                      return router.push("/profile");
                    }}
                  >
                    Profile
                  </h4>
                </div>
              )}

              {mounted && !user && (
                <div className="ml-2 px-4 py-2 bg-blue-700 text-white rounded-md text-sm font-semibold cursor-pointer">
                  <h4
                    onClick={() => {
                      setIsOpen(false);
                      return router.push("/auth/signin");
                    }}
                  >
                    Login
                  </h4>
                </div>
              )}

              {mounted && user && (
                <div
                  className="ml-2 px-4 py-2 bg-blue-700 text-white rounded-md text-sm font-semibold cursor-pointer"
                  onClick={() => {
                    setIsOpen(false);
                    return handleSignOut();
                  }}
                >
                  <h4>Logout</h4>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;