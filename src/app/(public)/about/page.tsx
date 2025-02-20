"use client";
// src/app/(public)/company/page.tsx
import { TiTick } from "react-icons/ti";
import { motion } from 'framer-motion'

export default function CompanyPage() {
  return (
    <section className="py-10 max-w-[75%] mx-auto space-y-16">

      {/* Who We Are */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        viewport={{ once: true, amount: 0.2 }}
        className="text-gray-600 text-base space-y-8"
      >
        <h2 className="text-4xl text-black">Who <span className="font-extrabold">We Are</span></h2>
        <p>Heat Craft Industries is a leading manufacturer of <span className="font-bold">fin and tube type heat exchangers, specializing in condenser coils</span> and cooling coils for various industrial applications. Based in Ghaziabad, India, we design and produce <span className="font-bold">high-efficiency heat exchangers</span> that enhance thermal performance and ensure optimal cooling efficiency</p>
        <p>Our expertise lies in engineering <span className="font-bold">customized heat exchangers using copper tubes and aluminum fins,</span> which provide excellent heat transfer capabilities. We cater to industries such as <span className="font-bold">HVAC, refrigeration, and process cooling,</span> delivering solutions that meet international standards of performance and durability</p>
        <p>With a focus on <span className="font-bold">precision engineering, innovative designs, and high-quality materials,</span> Heat Craft Industries is committed to providing <span className="font-bold">energy-efficient and cost-effective heat exchange solutions</span> for modern industrial needs.</p>
      </motion.div>

      {/* Our Mission */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        viewport={{ once: true, amount: 0.2 }}
        className="text-gray-600 text-base space-y-8"
      >
        <h2 className="text-4xl text-black">Our <span className="font-extrabold">Mission</span></h2>
        <p>At Heat Craft Industries, we are dedicated to</p>

        {[
          "Designing and manufacturing high-performance heat exchangers that maximize heat transfer efficiency.",
          "Providing customized solutions tailored to meet diverse industry requirements.",
          "Ensuring energy efficiency and sustainability in all our heat exchanger products.",
          "Adopting advanced manufacturing technologies for precision and reliability.",
          "Delivering consistent quality and long-term durability in all our heat exchanger designs."
        ].map((text, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, x: -50 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6, delay: index * 0.1 }} 
            viewport={{ once: true, amount: 0.2 }}
            className="flex gap-3 items-center"
          >
            <TiTick className="border rounded-full h-8 w-8 text-blue-700" />
            <p><span className="font-bold">{text.split(" ").slice(0, 2).join(" ")}</span> {text.split(" ").slice(2).join(" ")}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Our Vision */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        viewport={{ once: true, amount: 0.2 }}
        className="text-gray-600 text-base space-y-8"
      >
        <h2 className="text-4xl text-black">Our <span className="font-extrabold">Vision</span></h2>
        <p>At Heat Craft Industries, we are dedicated to</p>

        {[
          "Innovation in heat transfer technology to enhance cooling system performance.",
          "Expansion into international markets, making our heat exchangers globally trusted.",
          "Sustainable and eco-friendly designs that contribute to energy conservation.",
          "Continued investment in R&D to develop next-generation heat exchanger solutions.",
          "Uncompromised quality and customer-centric service to build long-term partnerships."
        ].map((text, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, x: -50 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6, delay: index * 0.1 }} 
            viewport={{ once: true, amount: 0.2 }}
            className="flex gap-3 items-center"
          >
            <TiTick className="border rounded-full h-8 w-8 text-blue-700" />
            <p><span className="font-bold">{text.split(" ").slice(0, 2).join(" ")}</span> {text.split(" ").slice(2).join(" ")}</p>
          </motion.div>
        ))}
      </motion.div>

    </section>
  );
}
