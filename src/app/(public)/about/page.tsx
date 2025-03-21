"use client";
// Updated CompanyPage component with certificates section
import { useState } from "react";
import { TiTick } from "react-icons/ti";
import { motion } from 'framer-motion';
import { IoMdClose } from "react-icons/io";

export default function CompanyPage() {
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);

  // Sample certificate data - replace with your actual certificates
  const certificates = [
    { id: "cert1", src: "/certificates/certificate1.jpg", alt: "ISO 9001 Certification" },
    { id: "cert2", src: "/certificates/certificate2.jpg", alt: "Industry Excellence Award" },
    { id: "cert3", src: "/certificates/certificate3.jpg", alt: "Quality Assurance Certificate" },
    { id: "cert4", src: "/certificates/certificate4.jpg", alt: "Environmental Compliance" },
  ];

  // Handle certificate click
  const handleCertificateClick = (certId: string) => {
    setSelectedCertificate(certId);
  };

  // Close modal
  const closeModal = () => {
    setSelectedCertificate(null);
  };

  // Prevent default behavior for context menu (right-click)
  const preventDownload = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    return false;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.2 }}
              className="cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              onClick={() => handleCertificateClick(cert.id)}
              onContextMenu={preventDownload}
              onTouchStart={preventDownload}
            >
              <div className="relative h-64 w-full">
                <img 
                  src={cert.src} 
                  alt={cert.alt}
                  className="w-full h-full object-cover" 
                  draggable="false"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white font-medium text-center px-4">{cert.alt}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
          onContextMenu={preventDownload}
          onTouchStart={preventDownload}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-lg z-10"
              onClick={closeModal}
            >
              <IoMdClose className="text-2xl" />
            </button>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg overflow-hidden shadow-2xl"
            >
              <img 
                src={certificates.find(c => c.id === selectedCertificate)?.src} 
                alt={certificates.find(c => c.id === selectedCertificate)?.alt}
                className="w-full h-auto" 
                draggable="false"
              />
            </motion.div>
          </div>
        </div>
      )}

      <div></div>
    </section>
  );
}