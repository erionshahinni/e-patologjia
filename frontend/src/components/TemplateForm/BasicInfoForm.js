// components/TemplateForm/BasicInfoForm.js
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

const BasicInfoForm = ({ formData, handleChange, handleReportTypeChange, errors = {} }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Details</CardTitle>
        <CardDescription>Enter basic information for the template</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Template Name
              {errors.name && (
                <span className="text-red-500 text-xs ml-2">{errors.name}</span>
              )}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter template name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Report Type
              {errors.reportType && (
                <span className="text-red-500 text-xs ml-2">{errors.reportType}</span>
              )}
            </label>
            <select
              name="reportType"
              value={formData.reportType}
              onChange={handleReportTypeChange || handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                ${errors.reportType ? 'border-red-500' : 'border-gray-300'}`}
              required
            >
              <option value="">Zgjedh llojin e raportit</option>
              <option value="Biopsy">Biopsy</option>
              <option value="PapTest">Pap Test</option>
              <option value="PapTest2">Pap Test 2</option>
              <option value="Cytology">Cytology</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoForm;