"use client";
import Image from "next/image"

import { MdOutlineMailOutline } from "react-icons/md";
import { IoCallOutline } from 'react-icons/io5'


import { TiSocialFacebook } from "react-icons/ti";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io5";
import { FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";


const Footer = () => {
  return (
    <div className="flex flex-col items-start justify-center px-2 lg:px-0 lg:max-w-[75%] mx-auto">
      <div className="  lg:grid  lg:grid-cols-4 py-16 space-x-5 space-y-12 ">
        {/* col 1 */}
        <div className="space-y-4 col-span-2">
          <Image src={"/logo.png"} height={100} width={100} alt="logo" className="cursor-pointer" onClick={() => { console.log("logo redirect to home") }} />
          <p className="text-sm text-gray-500">Heat Craft Industries is a leading manufacturer of fin and tube type heat exchangers, specializing in condenser coils and cooling coils for various industrial applications. </p>
        </div>



        {/* col 2 */}
        <div className=" flex flex-col justify-center items-start lg:items-center gap-y-2">
          <h3 className="text-blue-800  text-2xl font-[900] ">Navigation</h3>
          <div className="flex flex-col justify-start items-start px-2 gap-y-1 space-y-2">
            <Link href="/">  <h2 className="text-black text-lg hover:text-blue-700 font-bold cursor-pointer">Home</h2></Link>
            <Link href="/about">  <h2 className="text-black text-lg hover:text-blue-700 font-bold cursor-pointer">About Us</h2></Link>
            <Link href="/products">  <h2 className="text-black text-lg hover:text-blue-700 font-bold cursor-pointer">Products</h2></Link>
            <Link href="/contact">  <h2 className="text-black text-lg hover:text-blue-700 font-bold cursor-pointer">Contact Us</h2></Link>
          </div>
        </div>



        {/* col 3 */}
        <div className="mt-5 lg:mt-0 flex flex-col gap-y-2 justify-start items-start">
          <a
            href={`mailto:${process.env.NEXT_PUBLIC_CLIENT_EMAIL}`}
            className="flex items-center gap-3"
          >
            <MdOutlineMailOutline className="h-5 w-5" />
            <h3 className="hover:text-blue-700 text-lg font-semibold">{process.env.NEXT_PUBLIC_CLIENT_EMAIL}</h3>
          </a>
          <div className="flex items-center gap-3 text-black text-sm font-semibold cursor-pointer" onClick={() => console.log("hi")}>
            <IoCallOutline className="h-5 w-5" />
            <a
              href="tel:9310741664"
              className="block hover:text-blue-700 text-lg font-bold  cursor-pointer"
            >
              931-074-1664
            </a>            </div >
          <div className="mt-3 flex gap-3 text-gray-500 items-center">
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
          </div>
        </div>
      </div>



      <p className="text-xs text-gray-400">All Right Reserved | Copyright@2025</p>
    </div>
  )
}

export default Footer