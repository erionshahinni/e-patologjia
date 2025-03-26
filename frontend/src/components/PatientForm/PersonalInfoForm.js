import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

const PersonalInfoForm = ({ formData, handleChange, errors }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informatat Personale</CardTitle>
        <CardDescription>Enter patient's personal details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Emri
              {errors.firstName && (
                <span className="text-red-500 text-xs ml-2">{errors.firstName}</span>
              )}
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mbiemri
              {errors.lastName && (
                <span className="text-red-500 text-xs ml-2">{errors.lastName}</span>
              )}
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Datelindja
              {errors.dateOfBirth && (
                <span className="text-red-500 text-xs ml-2">{errors.dateOfBirth}</span>
              )}
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gjinia
              {errors.gender && (
                <span className="text-red-500 text-xs ml-2">{errors.gender}</span>
              )}
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Zgjedh gjinine</option>
              <option value="male">Mashkull</option>
              <option value="female">Femer</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Adresa
              {errors.address && (
                <span className="text-red-500 text-xs ml-2">{errors.address}</span>
              )}
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;