"use client";
// pages/custom-coil-form.js
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Head from 'next/head';
import { useCart } from '@/context/CartContext';
import { CustomCoilItemType } from '@/lib/interfaces/CartInterface';

export default function CustomCoilForm() {
    const { addCustomCoilToCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CustomCoilItemType>({
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
    distributorHoles: '',
    distributorHolesDontKnow: false,
    inletConnection: '',
    inletConnectionDontKnow: false,
    quantity: 1
  });

  // Dropdown states
  const [endplateDropdownOpen, setEndplateDropdownOpen] = useState(false);
  const [circuitDropdownOpen, setCircuitDropdownOpen] = useState(false);
  const endplateRef = useRef<HTMLDivElement | null>(null);
  const circuitRef = useRef<HTMLDivElement | null>(null);

  // Endplate options with images
  const endplateOptions = [
    { value: "box-type", label: "Box Type Plate with 4 Side Bending", image: "/custom-coil-info1.png" },
    { value: "u-type", label: "U Type Plate with 2 Side Bending", image: "/custom-coil-info1.png" },
    { value: "open-type", label: "Open Type Plate RG Model", image: "/custom-coil-info1.png" },
    { value: "open-type-top", label: "Open Type Plate with Top/RG Model", image: "/custom-coil-info1.png" },
    { value: "open-type-r", label: "Open Type Plate R Model", image: "/custom-coil-info1.png" },
    { value: "open-type-r-top", label: "Open Type Plate with Top/R Model", image: "/custom-coil-info1.png" },
    { value: "open-type-fan", label: "Open Type Plate with Fan Shroud/RGS", image: "/custom-coil-info1.png" },
    { value: "2-side-bending", label: "2 Side Bending Plate with Angle", image: "/custom-coil-info1.png" },
    { value: "old-model", label: "Old Model", image: "/custom-coil-info1.png" },
    { value: "open-type-top-angle", label: "Open Type Plate with Top & Angle/OM", image: "/custom-coil-info1.png" },
    { value: "4-side-bending", label: "4 Side Bending Plate with Top & Bottom", image: "/custom-coil-info1.png" },
    { value: "box-type-top-bottom", label: "Box Type Plate with Box Type Top & Bottom Plate", image: "/custom-coil-info1.png" },
  ];

  // Circuit options with images
  const circuitOptions = [
    { value: "1-in-1-out", label: "1 in 1 out", image: "/custom-coil-info1.png" },
    { value: "2-in-2-out", label: "2 in 2 out", image: "/custom-coil-info1.png" },
    { value: "4-in-4-out", label: "4 in 4 out", image: "/custom-coil-info1.png" },
    { value: "1-50-in-out", label: "1-50 in out", image: "/custom-coil-info1.png" },
  ];

  // Update the useEffect to properly close dropdowns with proper TypeScript event type
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (endplateRef.current && !endplateRef.current.contains(event.target as Node)) {
        setEndplateDropdownOpen(false);
      }
      if (circuitRef.current && !circuitRef.current.contains(event.target as Node)) {
        setCircuitDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCoilTypeSelection = (type: string) => {
    setFormData({ ...formData, coilType: type });
    setStep(2);
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      // Handle checkbox changes
      if (name === 'distributorHolesDontKnow') {
        setFormData({
          ...formData,
          distributorHolesDontKnow: checked,
          distributorHoles: checked ? "don't know" : formData.distributorHoles
        });
      } else if (name === 'inletConnectionDontKnow') {
        setFormData({
          ...formData,
          inletConnectionDontKnow: checked,
          inletConnection: checked ? "don't know" : formData.inletConnection
        });
      } else {
        setFormData({ ...formData, [name]: checked });
      }
    } else {
      // Handle regular input changes
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleOptionSelect = (name: string, value: string): void => {
    setFormData({ ...formData, [name]: value });

    if (name === 'endplateType') {
      setEndplateDropdownOpen(false);
    } else if (name === 'circuitType') {
      setCircuitDropdownOpen(false);
    }
  };


  const handleSubmit = (e: any) => {
    e.preventDefault();

    // In a real application, you would send this data to your API
    console.log("Form submitted:", formData);

    // Move to a confirmation step
    setStep(7);
  };

  const goBack = () => {
    setStep(step - 1);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const renderProgressBar = () => {
    const totalSteps = formData.coilType === 'cooling' ? 7 : 6;

    return (
      <div className="mt-2 flex items-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <>
            <span
              key={`step-${index + 1}`}
              className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${step >= index + 1 ? 'bg-white text-blue-600' : 'bg-blue-400'
                } ${index > 0 ? 'mx-2' : 'mr-2'}`}
            >
              {index + 1}
            </span>
            {index < totalSteps - 1 && (
              <div key={`line-${index + 1}`} className="h-1 w-10 bg-blue-400"></div>
            )}
          </>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Head>
        <title>Custom Coil Configuration</title>
      </Head>

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 bg-blue-600 text-white">
          <h1 className="text-2xl font-bold">Custom Coil Configuration</h1>
          {renderProgressBar()}
        </div>

        <div className="p-6">
          {/* Step 1: Select Coil Type */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Step 1: Select Coil Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  onClick={() => handleCoilTypeSelection('condenser')}
                  className="border rounded-lg p-6 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all flex flex-col items-center"
                >
                  <div className="w-40 h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 text-gray-500">
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

          {/* Step 2: Coil Dimensions */}
          {step === 2 && (
            <form>
              <h2 className="text-xl font-semibold mb-6">
                Step 2: {formData.coilType === 'condenser' ? 'Condenser' : 'Cooling'} Coil Dimensions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="relative h-48 flex items-center justify-center">
                  <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center relative">
                    <Image src="/custom-coil-info1.png" alt="Coil dimensions diagram" fill className="object-contain p-2" />
                  </div>
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

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </form>
          )}

         {/* Step 3: Endplate Type - Fix height and display with proper TypeScript */}
{step === 3 && (
  <form>
    <h2 className="text-xl font-semibold mb-6">Step 3: Select Endplate Type</h2>

    <div className="grid grid-cols-1 gap-y-4">
      <div className="mb-4">
        <div className="w-full h-64 bg-gray-200 rounded-md mb-4 flex items-center justify-center relative">
          <Image src="/custom-coil-info1.png" alt="Endplate types" fill className="object-contain p-2" />
        </div>
        <p className="text-sm text-gray-500 text-center">Select the appropriate endplate type for your coil</p>
      </div>

      <div className="relative min-h-[300px]" ref={endplateRef}>
        <label className="block text-sm font-medium text-gray-700 mb-1">Endplate Type</label>
        <button
          type="button"
          className="w-full text-left border border-gray-300 rounded-md shadow-sm p-2 bg-white flex justify-between items-center"
          onClick={() => setEndplateDropdownOpen(!endplateDropdownOpen)}
        >
          {formData.endplateType 
            ? endplateOptions.find(opt => opt.value === formData.endplateType)?.label || "Select Endplate Type"
            : "Select Endplate Type"}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {endplateDropdownOpen && (
          <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
            {endplateOptions.map(option => (
              <div
                key={option.value}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => handleOptionSelect('endplateType', option.value)}
              >
                <div className="w-16 h-16 bg-gray-200 rounded-md mr-3 relative">
                  <Image src={option.image} alt={option.label} fill className="object-contain p-1" />
                </div>
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    <div className="mt-8 flex justify-between">
      <button
        type="button"
        onClick={goBack}
        className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
      >
        Back
      </button>
      <button
        type="button"
        onClick={nextStep}
        className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
      >
        Next
      </button>
    </div>
  </form>
)}

{/* Step 4: Circuit Type - Fix height and display with proper TypeScript */}
{step === 4 && (
  <form>
    <h2 className="text-xl font-semibold mb-6">Step 4: Select Circuit Type</h2>

    <div className="grid grid-cols-1 gap-y-4">
      <div className="mb-4">
        <div className="w-full h-64 bg-gray-200 rounded-md mb-4 flex items-center justify-center relative">
          <Image src="/custom-coil-info1.png" alt="Circuit type diagram" fill className="object-contain p-2" />
        </div>
        <p className="text-sm text-gray-500 text-center">Select the appropriate circuit configuration</p>
      </div>

      <div className="relative min-h-[300px]" ref={circuitRef}>
        <label className="block text-sm font-medium text-gray-700 mb-1">Circuit Type</label>
        <button
          type="button"
          className="w-full text-left border border-gray-300 rounded-md shadow-sm p-2 bg-white flex justify-between items-center"
          onClick={() => setCircuitDropdownOpen(!circuitDropdownOpen)}
        >
          {formData.circuitType 
            ? circuitOptions.find(opt => opt.value === formData.circuitType)?.label || "Select Circuit Type"
            : "Select Circuit Type"}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {circuitDropdownOpen && (
          <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
            {circuitOptions.map(option => (
              <div
                key={option.value}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => handleOptionSelect('circuitType', option.value)}
              >
                <div className="w-16 h-16 bg-gray-200 rounded-md mr-3 relative">
                  <Image src={option.image} alt={option.label} fill className="object-contain p-1" />
                </div>
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        )}
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
    </div>

    <div className="mt-8 flex justify-between">
      <button
        type="button"
        onClick={goBack}
        className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
      >
        Back
      </button>
      <button
        type="button"
        onClick={nextStep}
        className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
      >
        Next
      </button>
    </div>
  </form>
)}

          {/* Step 5: Header Size and Materials */}
          {step === 5 && (
            <form>
              <h2 className="text-xl font-semibold mb-6">Step 5: Header Size and Materials</h2>

              <div className="grid grid-cols-1 gap-y-4">
                <div className="mb-4">
                  <div className="w-full h-64 bg-gray-200 rounded-md mb-4 flex items-center justify-center relative">
                    <Image src="/custom-coil-info1.png" alt="Header and materials diagram" fill className="object-contain p-2" />
                  </div>
                  <p className="text-sm text-gray-500 text-center">Select the appropriate header size and materials</p>
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

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                {formData.coilType === 'cooling' ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Step 6: Distributor Type (Only for Cooling Coil) */}
          {step === 6 && formData.coilType === 'cooling' && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold mb-6">Step 6: Distributor Type</h2>

              <div className="grid grid-cols-1 gap-y-4">
                <div className="mb-4">
                  <div className="w-full h-64 bg-gray-200 rounded-md mb-4 flex items-center justify-center relative">
                    <Image src="/custom-coil-info1.png" alt="Distributor type diagram" fill className="object-contain p-2" />
                  </div>
                  <p className="text-sm text-gray-500 text-center">Specify the distributor configuration for your cooling coil</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Number of Holes</label>
                  <div className="flex items-center mt-1">
                    <input
                      type="number"
                      name="distributorHoles"
                      value={formData.distributorHolesDontKnow ? "" : formData.distributorHoles}
                      onChange={handleChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      disabled={formData.distributorHolesDontKnow}
                      required={!formData.distributorHolesDontKnow}
                    />
                    <div className="ml-4 flex items-center">
                      <input
                        type="checkbox"
                        id="distributorHolesDontKnow"
                        name="distributorHolesDontKnow"
                        checked={formData.distributorHolesDontKnow}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="distributorHolesDontKnow" className="ml-2 block text-sm text-gray-700">
                        Don't know
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Inlet Connection</label>
                  <div className="flex items-center mt-1">
                  <input
                      type="number"
                      name="inletConnection"
                      value={formData.inletConnectionDontKnow ? "" : formData.inletConnection}
                      onChange={handleChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      disabled={formData.inletConnectionDontKnow}
                      required={!formData.inletConnectionDontKnow}
                    />
                    <div className="ml-4 flex items-center">
                      <input
                        type="checkbox"
                        id="inletConnectionDontKnow"
                        name="inletConnectionDontKnow"
                        checked={formData.inletConnectionDontKnow}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="inletConnectionDontKnow" className="ml-2 block text-sm text-gray-700">
                        Don't know
                      </label>
                    </div>
                  </div>
                </div>
              </div>

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
                  Submit
                </button>
              </div>
            </form>
          )}

          {/* Step 7: Confirmation */}
          {step === 7 && (
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

                  <div className="font-medium">Number of Circuits:</div>
                  <div>{formData.numberOfCircuits}</div>

                  <div className="font-medium">Endplate Type:</div>
                  <div>{formData.endplateType}</div>

                  <div className="font-medium">Header Size:</div>
                  <div>{formData.headerSize}</div>

                  <div className="font-medium">Tube Type:</div>
                  <div>{formData.tubeType}</div>

                  <div className="font-medium">Fin Type:</div>
                  <div>{formData.finType}</div>

                  {formData.coilType === 'cooling' && (
                    <>
                      <div className="font-medium">Distributor Holes:</div>
                      <div>{formData.distributorHolesDontKnow ? "Don't know" : formData.distributorHoles}</div>

                      <div className="font-medium">Inlet Connection:</div>
                      <div>{formData.inletConnectionDontKnow ? "Don't know" : formData.inletConnection}</div>
                    </>
                  )}
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
                  onClick={() => {
                    addCustomCoilToCart(formData);
                    alert("Item added successfully");
                    return router.push('/cart');
                  }}
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