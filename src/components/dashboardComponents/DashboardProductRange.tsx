import React from 'react'
import { SiRoamresearch } from "react-icons/si";


const DashboardProductRange = () => {
    return (
        <div className='w-full bg-purple-100 py-24 px-32 flex flex-col justify-center items-center space-y-16'>
            <h3 className='text-3xl font-semibold mb-5'>Comprehensive Products Range</h3>
            <div className='grid  grid-cols-2 lg:grid-cols-4 space-x-10 '>
                {/* Item 1 */}
                <div className='flex flex-col items-center justify-center gap-2'>
                    <div className='p-2 bg-gray-100 rounded-full'>
                        <SiRoamresearch className='w-8 h-8 text-green-300' />
                    </div>
                    <h3 className='font-semibold text-center'>Unit Coolers</h3>
                    <p className='text-sm text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, laboriosam, ipsa magni dolor aliquam sed harum numquam veniam unde libero inventore optio praesentium mollitia delectus, voluptatum modi vero odit tempora.</p>
                </div>
                 {/* Item 2 */}
                 <div className='flex flex-col items-center justify-center gap-2'>
                    <div className='p-2 bg-gray-100 rounded-full'>
                        <SiRoamresearch className='w-8 h-8 text-green-300' />
                    </div>
                    <h3 className='font-semibold text-center'>Condensing Units</h3>
                    <p className='text-sm text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, laboriosam, ipsa magni dolor aliquam sed harum numquam veniam unde libero inventore optio praesentium mollitia delectus, voluptatum modi vero odit tempora.</p>
                </div>
                 {/* Item 3 */}
                 <div className='flex flex-col items-center justify-center gap-2'>
                    <div className='p-2 bg-gray-100 rounded-full'>
                        <SiRoamresearch className='w-8 h-8 text-green-300' />
                    </div>
                    <h3 className='font-semibold text-center'>Compressorized Racks</h3>
                    <p className='text-sm text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, laboriosam, ipsa magni dolor aliquam sed harum numquam veniam unde libero inventore optio praesentium mollitia delectus, voluptatum modi vero odit tempora.</p>
                </div>
                 {/* Item 4 */}
                 <div className='flex flex-col items-center justify-center gap-2'>
                    <div className='p-2 bg-gray-100 rounded-full'>
                        <SiRoamresearch className='w-8 h-8 text-green-300' />
                    </div>
                    <h3 className='font-semibold text-center'>Condensors</h3>
                    <p className='text-sm text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, laboriosam, ipsa magni dolor aliquam sed harum numquam veniam unde libero inventore optio praesentium mollitia delectus, voluptatum modi vero odit tempora.</p>
                </div>
            </div>

        </div>
    )
}

export default DashboardProductRange