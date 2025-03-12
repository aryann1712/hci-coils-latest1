import React from 'react'
import { IoCallOutline } from 'react-icons/io5'

const DashboardLowerBottom = () => {
  return (
    <div className=' bg-blue-800 px-2 py-12 lg:px-28 lg:py-20 grid lg:grid-cols-3'>

      {/* item 1 */}
      <div className='col-span-2 text-white space-y-5 px-3 lg:px-10 max-w-2xl'>
        <h2 className='text-2xl lg:text-3xl font-extrabold'>Heat Craft Industries</h2>
        <p className='text-sm lg:text-base font-thin '>In today&apos;s fast-paced world, the demand for efficient heating solutions is more critical than ever. The heat craft industry has emerged as a vital sector, providing innovative heating technologies that cater to various needs </p>
      </div>

      {/* item 2 */}
      <div className=' mt-10 lg:mt-0 hidden lg:flex flex-row  justify-center items-center gap-10'>
        {/* logo */}
        <div className=' flex flex-row justify-center items-center gap-2'>
          <IoCallOutline className='text-white h-8 w-8' />
          {/* call and phone number */}
          <div className='text-sm font-semibold text-white'>
            <h3>Call Us Now</h3>
            <a
              href="tel:9315045029"
              className="block text-lg font-bold  cursor-pointer"
            >
              931-504-5029
            </a>
          </div>
        </div>

        {/* Line */}
        <div className='hidden lg:block h-14 bg-white w-[0.5px]'></div>
      </div>

    </div>
  )
}

export default DashboardLowerBottom