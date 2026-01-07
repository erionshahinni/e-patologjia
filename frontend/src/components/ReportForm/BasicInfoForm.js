// components/ReportForm/BasicInfoForm.js
import React, { useState, useEffect, memo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { PlusCircle, X, FileText, Building2, MapPin, UserCheck, Users, DollarSign, Calendar, Hash } from 'lucide-react';
import Button from '../ui/button';

// FormField component moved outside to prevent re-creation on each render
const FormField = memo(({ icon: Icon, label, name, type = 'text', value, onChange, placeholder, required = false, options = null, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
      <Icon className="h-4 w-4 text-indigo-600" />
      <span>{label} {required && <span className="text-red-500">*</span>}</span>
    </label>
    {type === 'select' ? (
      <select
        name={name}
        value={value || ''}
        onChange={onChange}
        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 bg-white border transition-colors"
      >
        {options}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border transition-colors"
        placeholder={placeholder}
        required={required}
      />
    )}
  </div>
));

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
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Basic Information</CardTitle>
            <CardDescription className="mt-1">Enter medical and payment details (all fields are optional)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reference Number */}
          <FormField
            icon={Hash}
            label="Referenca"
            name="referenceNumber"
            value={formData.referenceNumber}
            onChange={handleChange}
            placeholder="Enter reference number"
          />

          {/* Healthcare Institution */}
          <FormField
            icon={Building2}
            label="Institucioni Shendetesor"
            name="healthcareInstitution"
            value={formData.healthcareInstitution}
            onChange={handleChange}
            placeholder="Enter healthcare institution"
          />

          {/* Healthcare Institution Address */}
          <FormField
            icon={MapPin}
            label="Adresa e Institucionit"
            name="institutionAddress"
            value={formData.institutionAddress || ''}
            onChange={handleChange}
            placeholder="Enter institution address"
          />

          {/* Main Referring Doctor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <UserCheck className="h-4 w-4 text-indigo-600" />
                <span>Mjeku udhezues kryesor</span>
              </label>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={addDoctor}
                className="text-xs flex items-center gap-1 py-1 h-auto text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
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
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border transition-colors"
              placeholder="Enter primary referring doctor"
            />
          </div>

          {/* Additional Referring Doctors - Shown immediately after the primary one */}
          {doctors && doctors.length > 0 && (
            <div className="md:col-span-2 space-y-3 pt-2 border-t border-gray-100">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                <Users className="h-4 w-4 text-indigo-600" />
                <span>Mjeke udhezues shtese</span>
              </label>
              {doctors.map((doctor, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={doctor}
                    onChange={(e) => updateDoctor(index, e.target.value)}
                    className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border transition-colors"
                    placeholder={`Mjeku udhezues ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeDoctor(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Payment Status */}
          <FormField
            icon={DollarSign}
            label="Statusi Pageses"
            name="paymentStatus"
            type="select"
            value={formData.paymentStatus}
            onChange={handleChange}
            options={
              <>
                <option value="">Zgjidh statusin</option>
                <option value="paid">Paguar</option>
                <option value="pending">Ne pritje</option>
                <option value="unpaid">Pa paguar</option>
              </>
            }
          />

          {/* Price */}
          <FormField
            icon={DollarSign}
            label="Cmimi"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
          />

          {/* Finished At */}
          <FormField
            icon={Calendar}
            label="Perfunduar me"
            name="finishedAt"
            type="date"
            value={formData.finishedAt}
            onChange={handleChange}
          />
        </div>

        {/* Note about optional fields */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 italic">All fields are optional. You can save the form with any combination of filled fields.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoForm;