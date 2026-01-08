import React, { memo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { User, Calendar, MapPin, UserCircle } from 'lucide-react';

// FormField component moved outside to prevent re-creation on each render
const FormField = memo(({ icon: Icon, label, name, type = 'text', value, onChange, error, options = null, className = '', required = false }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
      <Icon className="h-4 w-4 text-indigo-600" />
      <span>{label} {required && <span className="text-red-500">*</span>}</span>
      {error && (
        <span className="text-red-500 text-xs font-normal ml-2">{error}</span>
      )}
    </label>
    {type === 'select' ? (
      <select
        name={name}
        value={value || ''}
        onChange={onChange}
        required={required}
        className={`mt-1 block w-full rounded-lg border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 bg-white transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        {options}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        required={required}
        className={`mt-1 block w-full rounded-lg border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
    )}
  </div>
));

const PersonalInfoForm = ({ formData, handleChange, errors }) => {
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <UserCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Informatat Personale</CardTitle>
            <CardDescription className="mt-1">Enter patient's personal details</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            icon={User}
            label="Emri"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />

          <FormField
            icon={User}
            label="Mbiemri"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />

          <FormField
            icon={Calendar}
            label="Datelindja"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
          />

          <FormField
            icon={UserCircle}
            label="Gjinia"
            name="gender"
            type="select"
            value={formData.gender}
            onChange={handleChange}
            error={errors.gender}
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
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            className="md:col-span-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;