import React from 'react'
import { GrMoney } from "react-icons/gr";
import { LuComputer } from "react-icons/lu";
import { FaRegHandshake } from "react-icons/fa";



const DashboardWhyChooseUs = () => {
    return (
        <div className='w-full lg:w-[55%] mx-auto flex flex-col gap-y-16 py-10 justify-center items-center'>
            <h2 className='text-3xl font-medium'>Why people Choose the <span className='font-bold'>Heat Craft Industries</span></h2>
            <div className='grid grid-cols-2 lg:grid-cols-3 space-x-10'>
                {/* Item 1 */}
                <div className='flex flex-col justify-center items-center gap-y-5'>
                    <GrMoney className='text-blue-700 w-24 h-24' />
                    <h3 className='text-2xl font-semibold'>Energy Efficiency</h3>
                    <p className='text-sm text-gray-500 text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis id unde voluptatem labore expedita mollitia, ipsam sint adipisci saepe. Quia temporibus nam saepe sequi deserunt unde expedita rem, voluptate magni.</p>
                </div>
                {/* Item 2 */}
                <div className='flex flex-col justify-center items-center gap-y-5'>
                    <LuComputer className='text-red-700 w-24 h-24' />
                    <h3 className='text-2xl font-semibold'>Advanced Technology</h3>
                    <p className='text-sm text-gray-500 text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis id unde voluptatem labore expedita mollitia, ipsam sint adipisci saepe. Quia temporibus nam saepe sequi deserunt unde expedita rem, voluptate magni.</p>
                </div>
                {/* Item 3 */}
                <div className='flex flex-col justify-center items-center gap-y-5'>
                    <FaRegHandshake className='text-green-700 w-24 h-24' />
                    <h3 className='text-2xl font-semibold'>Reliability and Durability</h3>
                    <p className='text-sm text-gray-500 text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis id unde voluptatem labore expedita mollitia, ipsam sint adipisci saepe. Quia temporibus nam saepe sequi deserunt unde expedita rem, voluptate magni.</p>
                </div>

            </div>
        </div>
    )
}

export default DashboardWhyChooseUs