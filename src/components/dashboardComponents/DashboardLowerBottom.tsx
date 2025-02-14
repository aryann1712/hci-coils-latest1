import React from 'react'
import { IoCallOutline } from 'react-icons/io5'

const DashboardLowerBottom = () => {
  return (
     <div className='bg-blue-700 px-28 py-20 grid lg:grid-cols-3'>
    
          {/* item 1 */}
          <div className='col-span-2 text-white space-y-5 px-10'>
            <h2 className='text-3xl font-bold'>Heat Craft Industries</h2>
            <p className='text-sm '>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam provident ullam enim at repudiandae, adipisci eius nam consequatur corrupti, possimus quis fugiat! Quidem dolore debitis aperiam vel. Officia, nemo quos. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nisi nobis nostrum perspiciatis, adipisci magnam repellendus magni, aliquam alias doloremque quasi fuga iure praesentium voluptate sunt quisquam earum tenetur ullam vero?</p>
          </div>
    
          {/* item 2 */}
          <div className='flex flex-row justify-center items-center gap-2'>
            {/* logo */}
            <IoCallOutline className='text-white h-8 w-8' />
            {/* call and phone number */}
            <div className='text-sm font-semibold text-white'>
              <h3>Call Us Now</h3>
              <h3>931-504-5029</h3>
            </div>
            {/* Line */}
            <div className='h-14 bg-white w-[1px]'></div>
          </div>
    
        </div>
  )
}

export default DashboardLowerBottom