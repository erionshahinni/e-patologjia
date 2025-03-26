// components/ReportForm/BasicInfoForm.js
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { PlusCircle, X } from 'lucide-react';
import Button from '../ui/button';

const BasicInfoForm = ({ formData, handleChange }) => {
  // Extract existing doctors from formData or initialize as empty array
  const [doctors, setDoctors] = useState([]);
  
  // Initialize doctors from formData when component mounts or formData changes
  useEffect(() => {
    try {
      if (formData.referringDoctors) {
        const parsedDoctors = JSON.parse(formData.referringDoctors);
        if (Array.isArray(parsedDoctors)) {
          setDoctors(parsedDoctors);
        }
      }
    } catch (error) {
      console.error("Error parsing referringDoctors:", error);
      setDoctors([]);
    }
  }, [formData.referringDoctors]);
  
  // Handle adding a new doctor
  const addDoctor = () => {
    const updatedDoctors = [...doctors, ''];
    setDoctors(updatedDoctors);
    // Update the main form data with the JSON string of doctors
    handleChange({
      target: {
        name: 'referringDoctors',
        value: JSON.stringify(updatedDoctors)
      }
    });
  };
  
  // Handle removing a doctor
  const removeDoctor = (index) => {
    const updatedDoctors = [...doctors];
    updatedDoctors.splice(index, 1);
    setDoctors(updatedDoctors);
    // Update the main form data with the JSON string of doctors
    handleChange({
      target: {
        name: 'referringDoctors',
        value: JSON.stringify(updatedDoctors)
      }
    });
  };
  
  // Handle updating a doctor's name
  const updateDoctor = (index, value) => {
    const updatedDoctors = [...doctors];
    updatedDoctors[index] = value;
    setDoctors(updatedDoctors);
    // Update the main form data with the JSON string of doctors
    handleChange({
      target: {
        name: 'referringDoctors',
        value: JSON.stringify(updatedDoctors)
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Enter medical and payment details (all fields are optional)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reference Number */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Referenca</label>
            <input
              type="text"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter reference number"
            />
          </div>

          {/* Healthcare Institution */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Institucioni Shendetesor
            </label>
            <input
              type="text"
              name="healthcareInstitution"
              value={formData.healthcareInstitution}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter healthcare institution"
            />
          </div>

          {/* Healthcare Institution Address - NEW FIELD */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Adresa e Institucionit
            </label>
            <input
              type="text"
              name="institutionAddress"
              value={formData.institutionAddress || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter institution address"
            />
          </div>

          {/* Main Referring Doctor (backwards compatibility) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Mjeku udhezues kryesor
              </label>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={addDoctor}
                className="text-xs flex items-center gap-1 py-1 h-auto"
              >
                <PlusCircle className="h-3 w-3" />
                Shto mjekun
              </Button>
            </div>
            <input
              type="text"
              name="referringDoctor"
              value={formData.referringDoctor}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter primary referring doctor"
            />
          </div>

          {/* Additional Referring Doctors - Shown immediately after the primary one */}
          {doctors && doctors.length > 0 && (
            <div className="md:col-span-2 space-y-3">
              {doctors.map((doctor, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={doctor}
                    onChange={(e) => updateDoctor(index, e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder={`Mjeku udhezues ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeDoctor(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Payment Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Statusi Pageses
            </label>
            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Zgjidh statusin</option>
              <option value="paid">Paguar</option>
              <option value="pending">Ne pritje</option>
              <option value="unpaid">Pa paguar</option>
            </select>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Cmimi</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter price"
            />
          </div>

          {/* Finished At */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Perfunduar me
            </label>
            <input
              type="date"
              name="finishedAt"
              value={formData.finishedAt}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Note about optional fields */}
        <div className="mt-6 text-sm text-gray-500">
          <p>All fields are optional. You can save the form with any combination of filled fields.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoForm;