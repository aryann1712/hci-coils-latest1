"use client";
// pages/custom-coil-form.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Head from 'next/head';

export default function CustomCoilForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    coilType: '',
    height: '',
    length: '',
    rows: '',
    fpi: '',
    endplateType: '',
    circuitType: '',
    numberOfCircuits: '',
    headerSize: '',
    tubeType: '',
    finType: '',
  });

  const handleCoilTypeSelection = (type: string) => {
    setFormData({ ...formData, coilType: type });
    setStep(2);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    
    // In a real application, you would send this data to your API
    console.log("Form submitted:", formData);
    
    // For demo purposes, just move to a confirmation step
    setStep(3);
  };

  const goBack = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Head>
        <title>Custom Coil Configuration</title>
      </Head>
      
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 bg-blue-600 text-white">
          <h1 className="text-2xl font-bold">Custom Coil Configuration</h1>
          <div className="mt-2 flex items-center">
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-white text-blue-600' : 'bg-blue-400'} mr-2`}>1</span>
            <div className="h-1 w-10 bg-blue-400"></div>
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-white text-blue-600' : 'bg-blue-400'} mx-2`}>2</span>
            <div className="h-1 w-10 bg-blue-400"></div>
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-white text-blue-600' : 'bg-blue-400'} ml-2`}>3</span>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Select Coil Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  onClick={() => handleCoilTypeSelection('condenser')}
                  className="border rounded-lg p-6 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all flex flex-col items-center"
                >
                  <div className="w-40 h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                    {/* In a real app, replace with actual image */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium">Condenser Coil</h3>
                  <p className="text-gray-500 text-center mt-2">Heat rejection coil typically used in AC units</p>
                </div>

                <div 
                  onClick={() => handleCoilTypeSelection('cooling')}
                  className="border rounded-lg p-6 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all flex flex-col items-center"
                >
                  <div className="w-40 h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                    {/* In a real app, replace with actual image */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium">Cooling Coil</h3>
                  <p className="text-gray-500 text-center mt-2">Direct expansion cooling coil for air handling units</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold mb-6">
                {formData.coilType === 'condenser' ? 'Condenser' : 'Cooling'} Coil Specifications
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="relative">
                  <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                    {/* In a real app, replace with actual image based on selections */}
                    <Image src={"/custom-coil-info1.png"} alt="" fill className="w-16 h-16 text-gray-500"/>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg> */}
                  </div>
                  <p className="text-sm text-gray-500 text-center">Coil diagram updates based on specifications</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Height (inches)</label>
                    <input 
                      type="number" 
                      name="height" 
                      value={formData.height} 
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Length (inches)</label>
                    <input 
                      type="number" 
                      name="length" 
                      value={formData.length} 
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Number of Rows</label>
                    <input 
                      type="number" 
                      name="rows" 
                      value={formData.rows} 
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fins Per Inch (FPI)</label>
                    <input 
                      type="number" 
                      name="fpi" 
                      value={formData.fpi} 
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Endplate Type</label>
                  <select 
                    name="endplateType" 
                    value={formData.endplateType} 
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Select Endplate Type</option>
                    <option value="box-type">Box Type Plate</option>
                    <option value="u-type">U Type Plate with 2 Side Bending</option>
                    <option value="open-type">Open Type Plate</option>
                    <option value="open-type-top">Open Type Plate with Top</option>
                    <option value="open-type-r">Open Type Plate R Model</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Circuit Type</label>
                  <select 
                    name="circuitType" 
                    value={formData.circuitType} 
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Select Circuit Type</option>
                    <option value="1-in-1-out">1 in 1 out</option>
                    <option value="2-in-2-out">2 in 2 out</option>
                    <option value="4-in-4-out">4 in 4 out</option>
                    <option value="1-50-in-out">1-50 in out</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Number of Circuits</label>
                  <input 
                    type="number" 
                    name="numberOfCircuits" 
                    value={formData.numberOfCircuits} 
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Header Size</label>
                  <select 
                    name="headerSize" 
                    value={formData.headerSize} 
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Select Header Size</option>
                    <option value="5/8">5/8"</option>
                    <option value="6/8">6/8"</option>
                    <option value="7/8">7/8"</option>
                    <option value="1-1/8">1-1/8"</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tube Type</label>
                  <select 
                    name="tubeType" 
                    value={formData.tubeType} 
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Select Tube Type</option>
                    <option value="copper-3/8">Copper Tube 3/8"</option>
                    <option value="copper-7mm">Copper Tube 7mm</option>
                    <option value="copper-plain">Copper Pipe Plain LWC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Fin Type</label>
                  <select 
                    name="finType" 
                    value={formData.finType} 
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Select Fin Type</option>
                    <option value="aluminum-bare">Aluminium Fin Bare</option>
                    <option value="hydrophilic-blue">Hydrophilic Blue Coated</option>
                  </select>
                </div>
              </div>

              {formData.coilType === 'cooling' && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-700 mb-3">Distributor Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Number of Holes</label>
                      <select 
                        name="distributorHoles" 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      >
                        <option value="">Select Option</option>
                        <option value="5">5</option>
                        <option value="not-known">Not Known</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Inlet Connection</label>
                      <select 
                        name="inletConnection"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      >
                        <option value="">Select Option</option>
                        <option value="5/8">5/8"</option>
                        <option value="6/8">6/8"</option>
                        <option value="7/8">7/8"</option>
                        <option value="1-1/8">1-1/8"</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <button 
                  type="button" 
                  onClick={goBack}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Configuration Complete!</h2>
              <p className="text-gray-600 mb-6">Your custom coil configuration has been submitted successfully.</p>
              
              <div className="bg-gray-50 rounded-lg p-6 text-left mb-6">
                <h3 className="font-medium mb-3">Configuration Summary</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="font-medium">Coil Type:</div>
                  <div className="capitalize">{formData.coilType}</div>
                  
                  <div className="font-medium">Dimensions:</div>
                  <div>{formData.height}" × {formData.length}"</div>
                  
                  <div className="font-medium">Rows:</div>
                  <div>{formData.rows}</div>
                  
                  <div className="font-medium">FPI:</div>
                  <div>{formData.fpi}</div>
                  
                  <div className="font-medium">Circuit Type:</div>
                  <div>{formData.circuitType}</div>
                  
                  <div className="font-medium">Endplate Type:</div>
                  <div>{formData.endplateType}</div>
                  
                  <div className="font-medium">Tube Type:</div>
                  <div>{formData.tubeType}</div>
                  
                  <div className="font-medium">Fin Type:</div>
                  <div>{formData.finType}</div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={goBack}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Edit Configuration
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Finish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}