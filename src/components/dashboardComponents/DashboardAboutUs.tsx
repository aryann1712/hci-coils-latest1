"use client";

import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'

const DashboardAboutUs = () => {
    return (
        <div className='w-full lg:w-[75%] mx-auto flex flex-col gap-y-10 py-10 justify-center items-center max-w-5xl'>
            {/* Row -1 */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.2 }} // Animation triggers when 20% of the section is visible
                className='grid grid-cols-1 lg:grid-cols-3 items-center justify-center text-center gap-y-5'
            >
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className='flex justify-center'
                >
                    <Image src={"/hero.jpg"} alt="Hero" height={800} width={800} className='rounded-full h-72 w-72 object-cover' />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className='lg:col-span-2 space-y-4 text-center lg:text-left px-4  max-w-2xl'
                >
                    <h2 className='font-bold text-4xl'>About Us - Heat Craft Industries</h2>
                    <p className='text-base font-light text-gray-500'>
                        Heat Craft Industries is a leading manufacturer of fin and tube type heat exchangers, specializing in condenser coils and cooling coils for various industrial applications. Based in Ghaziabad, India, we design and produce high-efficiency heat exchangers that enhance thermal performance and ensure optimal cooling efficiency.
                    </p>
                </motion.div>
            </motion.div>

            {/* Row -2 */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.2 }}
                className='grid grid-cols-1 lg:grid-cols-3 items-center justify-center text-center gap-y-5 mx-5'
            >
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className='lg:col-span-2 space-y-4 text-center lg:text-left px-4'
                >
                    <p className='text-base font-light text-gray-500'>
                        At Heat Craft Industry, we specialize in providing cutting-edge heating solutions designed to meet the diverse needs of residential, commercial, and industrial applications. With a commitment to energy efficiency, reliability, and customer satisfaction, we are dedicated to helping you create comfortable and sustainable environments.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className='flex justify-center'
                >
                    <Image src={"/hero.jpg"} alt="Hero" height={800} width={800} className='rounded-full h-72 w-72 object-cover' />
                </motion.div>
            </motion.div>
        </div>
    )
}

export default DashboardAboutUs
