"use client";

import { useState } from "react";
import { TiTick } from "react-icons/ti";
import { motion } from 'framer-motion';
import { FaFilePdf } from "react-icons/fa";

export default function CompanyPage() {
  // Update certificates with your actual PDF files
  const certificates = [
    { id: "cert1", src: "/certificates/HEAT CRAFT INDUSTRIES  9001 final.pdf", alt: "ISO 9001 Certification", type: "pdf" },
    { id: "cert2", src: "/certificates/heatCraftIndustries14001Final.pdf", alt: "ISO 14001 Certification", type: "pdf" },
    { id: "cert3", src: "/certificates/HEAT CRAFT INDUSTRIES 45001 final.pdf", alt: "ISO 45001 Certification", type: "pdf" },
    { id: "cert4", src: "/certificates/HEAT CRAFT INDUSTRIES CE MARK 504.pdf", alt: "CE Mark Certification", type: "pdf" },
    { id: "cert5", src: "/certificates/HEAT CRAFT INDUSTRIES ROHS 503.pdf", alt: "ROHS Certification", type: "pdf" },
    { id: "cert6", src: "/certificates/bis certificate.pdf", alt: "BIS Certificate", type: "pdf" },
    { id: "cert7", src: "/certificates/FACTORY LICENSE.pdf", alt: "Factory License", type: "pdf" },
    { id: "cert8", src: "/certificates/FIRE NOC.pdf", alt: "Fire NOC", type: "pdf" },
    { id: "cert9", src: "/certificates/GST REGISTRATION CERTIFICATE.pdf", alt: "GST Registration", type: "pdf" },
    { id: "cert10", src: "/certificates/MSME Udyam Registration Certificate LATEST.pdf", alt: "MSME Registration", type: "pdf" },
    { id: "cert11", src: "/certificates/2025030412 - heat craft industries - reach.pdf", alt: "REACH Certification", type: "pdf" },
    { id: "cert12", src: "/certificates/2025030414 - heat craft industries - iso 13585-2021.pdf", alt: "ISO 13585 Certification", type: "pdf" },
  ];

  // Handle certificate click
  const handleCertificateClick = (certSrc: string) => {
    // Open the PDF in a new tab
    window.open(certSrc, '_blank');
  };

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

      {/* Our Certificates */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        viewport={{ once: true, amount: 0.2 }}
        className="text-gray-600 text-base space-y-8"
      >
        <h2 className="text-4xl text-black">Our <span className="font-extrabold">Certificates</span></h2>
        <p>Heat Craft Industries maintains the highest standards of quality and compliance in the industry</p>
        
        {/* Certificate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificates.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.2 }}
              className="cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
              onClick={() => handleCertificateClick(cert.src)}
            >
              <div className="relative h-64 w-full bg-gray-100 flex flex-col items-center justify-center p-4">
                <FaFilePdf className="text-red-600 text-5xl mb-4" />
                <h3 className="text-center font-medium text-gray-800">{cert.alt}</h3>
                <div className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-md text-sm flex items-center">
                  <FaFilePdf className="mr-2" /> Open PDF
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div></div>
    </section>
  );
}