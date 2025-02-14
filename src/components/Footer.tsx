"use client";
import Image from "next/image"

import { MdOutlineMailOutline } from "react-icons/md";
import { IoCallOutline } from 'react-icons/io5'


import { TiSocialFacebook } from "react-icons/ti";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io5";
import { FaLinkedinIn } from "react-icons/fa";


const Footer = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-3 py-16 px-10 space-x-10 max-w-[70%]">
        {/* col 1 */}
        <div className="space-y-4">
          <Image src={"/logo.png"} height={100} width={100} alt="logo" className="cursor-pointer" onClick={() => { console.log("logo redirect to home") }} />
          <p className="text-xs text-gray-400">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis velit suscipit doloribus, perferendis libero unde odio nesciunt accusamus minus aspernatur fugiat consequuntur dignissimos autem facilis quos. Possimus expedita debitis fugit!</p>
        </div>



        {/* col 2 */}
        <div className=" flex flex-col justify-center items-center gap-y-2">
          <h3 className="text-blue-800  text-2xl font-bold ">Navigation</h3>
          <div className="flex flex-col justify-start items-start px-2 gap-y-1">
            <h2 className="text-black text-[14px] font-bold cursor-pointer" onClick={() => console.log("send to home")}>Home</h2>
            <h2 className="text-black text-[14px] font-bold cursor-pointer" onClick={() => console.log("send to home")}>About Us</h2>
            <h2 className="text-black text-[14px] font-bold cursor-pointer" onClick={() => console.log("send to home")}>Products</h2>
            <h2 className="text-black text-[14px] font-bold cursor-pointer" onClick={() => console.log("send to home")}>Contact Us</h2>
          </div>
        </div>



        {/* col 3 */}
        <div className="flex flex-col gap-y-2 justify-start items-start">
          <div className="flex items-center gap-3 text-black text-sm font-semibold cursor-pointer" onClick={() => console.log("hi")}>
            <MdOutlineMailOutline className="h-5 w-5" />
            <h3>{process.env.NEXT_PUBLIC_CLIENT_EMAIL}</h3>
          </div >
          <div className="flex items-center gap-3 text-black text-sm font-semibold cursor-pointer" onClick={() => console.log("hi")}>
            <IoCallOutline className="h-5 w-5" />
            <h3>931-504-5029</h3>
          </div >
          <div className="mt-3 flex gap-3 text-gray-500 items-center">
            <TiSocialFacebook className="h-6 w-6 cursor-pointer" />
            <FaXTwitter className="h-4 w-4  cursor-pointer" />
            <IoLogoInstagram className="h-5 w-5  cursor-pointer" />
            <FaLinkedinIn className="h-5 w-5  cursor-pointer" />
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400">All Right Reserved | Copyright@2025</p>
    </div>
  )
}

export default Footer