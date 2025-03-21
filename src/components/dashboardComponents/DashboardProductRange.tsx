import Image from 'next/image';

const DashboardProductRange = () => {
  return (
    <div className='w-full bg-gray-100 py-24 px-4 md:px-16 flex flex-col justify-center items-center space-y-16'>
      <h3 className='text-3xl font-normal text-center'>Comprehensive <span className='font-extrabold'>Products</span> Range</h3>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 w-full'>
        {/* Item 1 */}
        <div className='flex flex-col items-center justify-center gap-2'>
          <div className='p-2 bg-gray-100 rounded-full'>
            <Image src={"/icons/seo-grey.png"} alt='Unit Coolers Icon' height={300} width={300} className='h-16 w-16' />
          </div>
          <h3 className='text-2xl font-bold text-center'>Unit Coolers</h3>
          <p className='text-base font-light text-gray-500 text-center'>Designed for efficient cooling in various applications, our unit coolers are available in multiple configurations to suit different environments.</p>
        </div>
        
        {/* Item 2 */}
        <div className='flex flex-col items-center justify-center gap-2'>
          <div className='p-2 bg-gray-100 rounded-full'>
            <Image src={"/icons/seo-grey.png"} alt='Condensing Units Icon' height={300} width={300} className='h-16 w-16' />
          </div>
          <h3 className='text-2xl font-bold text-center'>Condensing Units</h3>
          <p className='text-base font-light text-gray-500 text-center'>Our condensing units are engineered for durability and performance, ensuring reliable operation in demanding conditions.</p>
        </div>
        
        {/* Item 3 */}
        <div className='flex flex-col items-center justify-center gap-2'>
          <div className='p-2 bg-gray-100 rounded-full'>
            <Image src={"/icons/seo-grey.png"} alt='Compressorized Racks Icon' height={300} width={300} className='h-16 w-16' />
          </div>
          <h3 className='text-2xl font-bold text-center'>Compressorized Racks</h3>
          <p className='text-base font-light text-gray-500 text-center'>These systems provide a compact and efficient solution for refrigeration needs, optimizing space while delivering powerful cooling.</p>
        </div>
        
        {/* Item 4 */}
        <div className='flex flex-col items-center justify-center gap-2'>
          <div className='p-2 bg-gray-100 rounded-full'>
            <Image src={"/icons/seo-grey.png"} alt='Condensors Icon' height={300} width={300} className='h-16 w-16' />
          </div>
          <h3 className='text-2xl font-bold text-center'>Condensors</h3>
          <p className='text-base font-light text-gray-500 text-center'>Built to withstand the rigors of commercial use, our condensers are designed for maximum efficiency and longevity.</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardProductRange