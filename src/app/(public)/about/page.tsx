"use client";

import { useState } from "react";
import { TiTick } from "react-icons/ti";
import { motion } from 'framer-motion';
import { FaImage } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

export default function CompanyPage() {
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);

  const certificates = [
    { id: "cert1", src: "/certificates/2025030412 - heat craft industries - reach.png", alt: "REACH Compliance Certificate", pages: 1 },
    { id: "cert2", src: "/certificates/2025030414 - heat craft industries - iso 13585-2021.png", alt: "ISO 13585-2021 Certificate", pages: 1 },
    { id: "cert3", src: "/certificates/FACTORY LICENSE.png", alt: "Factory License", pages: 1 },
    { id: "cert4", src: "/certificates/FIRE NOC.png", alt: "Fire NOC Certificate", pages: 1 },
    { id: "cert5", src: "/certificates/HEAT CRAFT INDUSTRIES  9001 final.png", alt: "ISO 9001 Certificate", pages: 1 },
    { id: "cert6", src: "/certificates/HEAT CRAFT INDUSTRIES 45001 final.png", alt: "ISO 45001 Certificate", pages: 1 },
    { id: "cert7", src: "/certificates/HEAT CRAFT INDUSTRIES CE MARK 504.png", alt: "CE Mark Certificate", pages: 1 },
    { id: "cert8", src: "/certificates/HEAT CRAFT INDUSTRIES ROHS 503.png", alt: "RoHS Compliance Certificate", pages: 1 },
    { id: "cert9", src: "/certificates/heatCraftIndustries14001Final.png", alt: "ISO 14001 Certificate", pages: 1 },
    { id: "cert10", src: "/certificates/UQ - 2025030413 - HEAT CRAFT INDUSTRIES -  EN 13134-2000 UKCERT.png", alt: "EN 13134-2000 UK Certificate", pages: 1 },
    { id: "cert11", src: "/certificates/bis/bis certificate_1.png", alt: "BIS Certificate", pages: 4, multiplePages: true, pagePattern: "/certificates/bis/bis certificate_{page}.png" },
    { id: "cert12", src: "/certificates/gst/GST REGISTRATION CERTIFICATE_1.png", alt: "GST Registration Certificate", pages: 3, multiplePages: true, pagePattern: "/certificates/gst/GST REGISTRATION CERTIFICATE_{page}.png" },
    { id: "cert13", src: "/certificates/udyam/MSME Udyam Registration Certificate LATEST_1.png", alt: "MSME Udyam Registration Certificate", pages: 2, multiplePages: true, pagePattern: "/certificates/udyam/MSME Udyam Registration Certificate LATEST_{page}.png" },
  ];

  // Handle certificate click
  const handleCertificateClick = (certificate: any) => {
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCertificate(null);
  };

  // Handle click outside modal to close
  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Prevent context menu (right-click)
  const preventContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  // For multi-page certificates, generate array of page sources
  const getPageSources = (certificate: any) => {
    if (!certificate) return [];
    
    if (certificate.pages === 1) {
      return [certificate.src];
    }
    
    if (certificate.multiplePages && certificate.pagePattern) {
      return Array.from({ length: certificate.pages }, (_, i) => 
        certificate.pagePattern.replace('{page}', i + 1)
      );
    }
    
    // Fallback for older format
    const baseSrc = certificate.src.replace('.png', '');
    return Array.from({ length: certificate.pages }, (_, i) => 
      `${baseSrc}_${i + 1}.png`
    );
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
              onClick={() => handleCertificateClick(cert)}
            >
              <div className="relative h-64 w-full flex flex-col items-center justify-center p-4">
                <div 
                  className="h-40 w-full bg-gray-100 mb-4 overflow-hidden flex items-center justify-center"
                  onContextMenu={preventContextMenu}
                >
                  <img 
                    src={cert.src} 
                    alt={cert.alt} 
                    className="object-contain h-full w-full select-none" 
                    draggable="false"
                  />
                </div>
                <h3 className="text-center font-medium text-gray-800">{cert.alt}</h3>
                <div className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-md text-sm flex items-center">
                  <FaImage className="mr-2" /> View Certificate
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal for full-size certificate viewing */}
      {isModalOpen && selectedCertificate && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={handleModalBackdropClick}
          onContextMenu={preventContextMenu}
        >
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold">{selectedCertificate.alt}</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <IoMdClose className="w-6 h-6" />
              </button>
            </div>
            
            <div 
              className="overflow-y-auto p-4 flex-grow" 
              style={{ userSelect: 'none' }}
            >
              {getPageSources(selectedCertificate).map((pageSrc, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <img 
                    src={pageSrc} 
                    alt={`${selectedCertificate.alt} - Page ${index + 1}`} 
                    className="mx-auto max-w-full pointer-events-none select-none" 
                    draggable="false"
                    onDragStart={() => false}
                  />
                  {selectedCertificate.pages > 1 && (
                    <p className="text-center text-sm text-gray-500 mt-2">
                      Page {index + 1} of {selectedCertificate.pages}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div></div>
    </section>
  );
}