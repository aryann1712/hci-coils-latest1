import React from 'react'
import { GrMoney } from "react-icons/gr";
import { LuComputer } from "react-icons/lu";
import { FaRegHandshake } from "react-icons/fa";

const DashboardWhyChooseUs = () => {
  return (
    <div className='w-full px-5 md:px-0 lg:w-[75%] mx-auto flex flex-col gap-y-16 py-10 justify-center items-center'>
      <h2 className='text-3xl font-medium text-center'>Why people Choose the <span className='font-extrabold'>Heat Craft Industries</span></h2>
      
      <div className='grid grid-cols-1 md:grid-cols-3 gap-10 w-full'>
        {/* Item 1 */}
        <div className='flex flex-col justify-start items-center gap-y-5'>
          <GrMoney className='text-blue-700 w-24 h-24' />
          <h3 className='text-2xl font-semibold'>Energy Efficiency</h3>
          <p className='text-sm text-gray-500 text-center'>One of the primary reasons people turn to the heat craft industry is the emphasis on energy efficiency. Modern heating systems are designed to consume less energy while providing optimal warmth.</p>
        </div>
        
        {/* Item 2 */}
        <div className='flex flex-col justify-start items-center gap-y-5'>
          <LuComputer className='text-red-700 w-24 h-24' />
          <h3 className='text-2xl font-semibold'>Advanced Technology</h3>
          <p className='text-sm text-gray-500 text-center'>The heat craft industry is at the forefront of technological innovation. From smart thermostats to advanced heat pumps, the latest heating solutions incorporate cutting-edge technology that enhances performance and user experience.</p>
        </div>
        
        {/* Item 3 */}
        <div className='flex flex-col justify-start items-center gap-y-5'>
          <FaRegHandshake className='text-green-700 w-24 h-24' />
          <h3 className='text-2xl font-semibold'>Reliability and Durability</h3>
          <p className='text-sm text-gray-500 text-center'>Investing in heating solutions is a long-term commitment, and reliability is a crucial factor for many consumers. The heat craft industry is known for producing high-quality, durable products that stand the test of time.</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardWhyChooseUs