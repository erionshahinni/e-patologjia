// components/EditPatient/PatientInfoForm.js
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import Button from '../ui/button';

const PatientInfoForm = ({ patientData, handleChange, handleSubmit }) => {
  // Add defensive check to prevent undefined errors
  if (!patientData) {
    return (
      <Card className="mb-8">
        <CardContent className="py-4 text-center">
          <p className="text-gray-500">Loading patient data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Patient Information</CardTitle>
        <CardDescription>Update patient's personal details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Emri
              </label>
              <input
                type="text"
                name="firstName"
                value={patientData.firstName || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mbiemri
              </label>
              <input
                type="text"
                name="lastName"
                value={patientData.lastName || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Datelindja
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={(patientData.dateOfBirth || '').split('T')[0]}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gjinia
              </label>
              <select
                name="gender"
                value={patientData.gender || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Zgjedh gjinine</option>
                <option value="male">Mashkull</option>
                <option value="female">Femer</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Adresa
              </label>
              <input
                type="text"
                name="address"
                value={patientData.address || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Update Patient</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientInfoForm;