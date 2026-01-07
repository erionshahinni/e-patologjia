// components/TemplateForm/BasicInfoForm.js
import React, { memo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { FileText, Activity } from 'lucide-react';

// FormField component moved outside to prevent re-creation on each render
const FormField = memo(({ icon: Icon, label, name, type = 'text', value, onChange, error, placeholder, required = false, options = null, className = '' }) => (
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
        className={`mt-1 block w-full rounded-lg border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 bg-white transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
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
        className={`mt-1 block w-full rounded-lg border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={placeholder}
        required={required}
      />
    )}
  </div>
));

const BasicInfoForm = ({ formData, handleChange, handleReportTypeChange, errors = {} }) => {
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FileText className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Template Details</CardTitle>
            <CardDescription className="mt-1">Enter basic information for the template</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            icon={FileText}
            label="Template Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter template name"
            required
          />

          <FormField
            icon={Activity}
            label="Report Type"
            name="reportType"
            type="select"
            value={formData.reportType}
            onChange={handleReportTypeChange || handleChange}
            error={errors.reportType}
            required
            options={
              <>
                <option value="">Zgjedh llojin e raportit</option>
                <option value="Biopsy">Biopsy</option>
                <option value="PapTest">Pap Test</option>
                <option value="PapTest2">Pap Test 2</option>
                <option value="Cytology">Cytology</option>
              </>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoForm;