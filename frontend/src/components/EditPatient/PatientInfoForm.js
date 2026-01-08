// components/EditPatient/PatientInfoForm.js
import React, { memo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import Button from '../ui/button';
import { User, Calendar, MapPin, UserCircle, Save } from 'lucide-react';

// FormField component moved outside to prevent re-creation on each render
const FormField = memo(({ icon: Icon, label, name, type = 'text', value, onChange, required = false, options = null }) => (
  <div className="space-y-2">
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
        required={required}
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
        required={required}
      />
    )}
  </div>
));

const PatientInfoForm = ({ patientData, handleChange, handleSubmit }) => {
  // Add defensive check to prevent undefined errors
  if (!patientData) {
    return (
      <Card className="mb-8 shadow-sm border border-gray-200">
        <CardContent className="py-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading patient data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 shadow-sm border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <UserCircle className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Patient Information</CardTitle>
            <CardDescription className="mt-1">Update patient's personal details</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              icon={User}
              label="Emri"
              name="firstName"
              value={patientData.firstName || ''}
              onChange={handleChange}
              required
            />

            <FormField
              icon={User}
              label="Mbiemri"
              name="lastName"
              value={patientData.lastName || ''}
              onChange={handleChange}
              required
            />

            <FormField
              icon={Calendar}
              label="Datelindja"
              name="dateOfBirth"
              type="date"
              value={(patientData.dateOfBirth || '').split('T')[0]}
              onChange={handleChange}
            />

            <FormField
              icon={UserCircle}
              label="Gjinia"
              name="gender"
              type="select"
              value={patientData.gender || ''}
              onChange={handleChange}
              options={
                <>
                  <option value="">Zgjedh gjinine</option>
                  <option value="male">Mashkull</option>
                  <option value="female">Femer</option>
                  <option value="other">Other</option>
                </>
              }
            />

            <FormField
              icon={MapPin}
              label="Adresa"
              name="address"
              value={patientData.address || ''}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button 
              type="submit"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
            >
              <Save className="h-4 w-4" />
              Update Patient
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientInfoForm;