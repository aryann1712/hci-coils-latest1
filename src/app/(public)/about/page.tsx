// src/app/(public)/company/page.tsx
import { TiTick } from "react-icons/ti";


export default function CompanyPage() {
  return (
    <section className="py-10 max-w-[75%] mx-auto space-y-16">

      <div className="text-gray-600 text-base space-y-8">
        <h2 className="text-4xl text-black">Who <span className="font-extrabold">We Are</span></h2>
        <p>Heat Craft Industries is a leading manufacturer of <span className="font-bold">fin and tube type heat exchangers, specializing in condenser coils</span> and cooling coils for various industrial applications. Based in Ghaziabad, India, we design and produce <span className="font-bold">high-efficiency heat exchangers</span> that enhance thermal performance and ensure optimal cooling efficiency</p>
        <p>Our expertise lies in engineering <span className="font-bold">customized heat exchangers using copper tubes and aluminum fins,</span> which provide excellent heat transfer capabilities. We cater to industries such as <span className="font-bold">HVAC, refrigeration, and process cooling,</span> delivering solutions that meet international standards of performance and durability</p>
        <p>With a focus on <span className="font-bold">precision engineering, innovative designs, and high-quality materials,</span> Heat Craft Industries is committed to providing <span className="font-bold">energy-efficient and cost-effective heat exchange solutions</span> for modern industrial needs. </p>
      </div>



      <div className="text-gray-600 text-base space-y-8">
        <h2 className="text-4xl text-black">Our <span className="font-extrabold">Mission</span></h2>
        <p>At Heat Craft Industries, we are dedicated to</p>
        <div className="flex gap-3 items-center">
          <TiTick className=" border rounded-full h-8 w-8 text-blue-700" />
          <p>Designing and manufacturing <span className="font-bold">high-performance heat exchangers</span> that maximize heat transfer efficiency.</p>
        </div>
        <div className="flex gap-3 items-center">
          <TiTick className=" border rounded-full h-8 w-8 text-blue-700" />
          <p>Providing <span className="font-bold">customized solutions</span> tailored to meet diverse industry requirements.</p>
        </div>
        <div className="flex gap-3 items-center">
          <TiTick className=" border rounded-full h-8 w-8 text-blue-700" />
          <p>Ensuring <span className="font-bold">energy efficiency and sustainability</span>  in all our heat exchanger products </p>
        </div>
        <div className="flex gap-3 items-center">
          <TiTick className=" border rounded-full h-8 w-8 text-blue-700" />
          <p>Adopting <span className="font-bold">advanced manufacturing technologies</span> for precision and reliability</p>
        </div>
        <div className="flex gap-3 items-center">
          <TiTick className=" border rounded-full h-8 w-8 text-blue-700" />
          <p>Delivering <span className="font-bold">consistent quality and long-term durability</span> in all our heat exchanger designs.</p>
        </div>
      </div>



      <div className="text-gray-600 text-base space-y-8">
        <h2 className="text-4xl text-black">Our <span className="font-extrabold">Vision</span></h2>
        <p>At Heat Craft Industries, we are dedicated to</p>
        <div className="flex gap-3 items-center">
          <TiTick className=" border rounded-full h-8 w-8 text-blue-700" />
          <p><span className="font-bold">Innovation in heat transfer technology </span> to enhance cooling system performance.</p>
        </div>
        <div className="flex gap-3 items-center">
          <TiTick className=" border rounded-full h-8 w-8 text-blue-700" />
          <p><span className="font-bold">Expansion into international markets,</span> making our heat exchangers globally trusted</p>
        </div>
        <div className="flex gap-3 items-center">
          <TiTick className=" border rounded-full h-8 w-8 text-blue-700" />
          <p><span className="font-bold">Sustainable and eco-friendly designs</span>  that contribute to energy conservation </p>
        </div>
        <div className="flex gap-3 items-center">
          <TiTick className=" border rounded-full h-8 w-8 text-blue-700" />
          <p><span className="font-bold">Continued investment in R&D</span> to develop next-generation heat exchanger solutions </p>
        </div>
        <div className="flex gap-3 items-center">
          <TiTick className=" border rounded-full h-8 w-8 text-blue-700" />
          <p><span className="font-bold">Uncompromised quality and customer-centric service</span> to build long-term partnerships</p>
        </div>
      </div>


     
    </section>
  );
}
