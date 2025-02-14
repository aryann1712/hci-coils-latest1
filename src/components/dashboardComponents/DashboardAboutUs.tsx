import Image from 'next/image'
import React from 'react'

const DashboardAboutUs = () => {
    return (
        <div className='w-full lg:w-[55%] mx-auto flex flex-col gap-y-10 py-10 justify-center items-center'>
            {/* Row -1 */}
            <div className='grid grid-cols-1 lg:grid-cols-3 items-center justify-center text-center gap-y-5'>
                <div className='flex justify-center'>
                    <Image src={"/hero.jpg"} alt="Hero" height={500} width={500} className='rounded-full h-60 w-60 object-cover' />
                </div>
                <div className='lg:col-span-2 space-y-4 text-center lg:text-left px-4 mx-5 '>
                    <h2 className='font-bold text-2xl'>About Us - Heat Craft Industries</h2>
                    <p className='text-sm text-gray-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum id quo facere unde aliquam aliquid recusandae exercitationem doloribus fugit, beatae itaque distinctio deserunt nisi, libero minima, delectus hic nostrum similique? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla veritatis alias vel hic inventore debitis, molestias voluptas iusto. Magni quaerat voluptatibus aspernatur saepe esse natus hic vitae maiores, ut nobis.</p>
                </div>
            </div>
            {/* Row -2 */}
            <div className='grid grid-cols-1 lg:grid-cols-3 items-center justify-center text-center gap-y-5 mx-5'>
                <div className='lg:col-span-2 space-y-4 text-center lg:text-left px-4'>
                    <p className='text-sm text-gray-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum id quo facere unde aliquam aliquid recusandae exercitationem doloribus fugit, beatae itaque distinctio deserunt nisi, libero minima, delectus hic nostrum similique? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla veritatis alias vel hic inventore debitis, molestias voluptas iusto. Magni quaerat voluptatibus aspernatur saepe esse natus hic vitae maiores, ut nobis.</p>
                </div>
                <div className='flex justify-center'>
                    <Image src={"/hero.jpg"} alt="Hero" height={500} width={500} className='rounded-full h-60 w-60 object-cover' />
                </div>
            </div>
        </div>
    )
}

export default DashboardAboutUs
