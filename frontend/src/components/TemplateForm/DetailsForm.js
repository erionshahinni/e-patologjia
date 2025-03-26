// components/TemplateForm/DetailsForm.js
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Save } from 'lucide-react';
import Button from '../ui/button';

const DetailsForm = ({ formData, handleChange, handleSubmit, errors = {}, isSubmitting = false }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Examination Details</CardTitle>
        <CardDescription>Enter template content based on report type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Common Field: Diagnosis */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Diagnosis
              {errors.diagnosis && (
                <span className="text-red-500 text-xs ml-2">{errors.diagnosis}</span>
              )}
            </label>
            <textarea
              name="diagnosis"
              value={formData.diagnosis || ''}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px]
                ${errors.diagnosis ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter diagnosis details"
            />
          </div>

          {/* Common Field: Sample */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Sample
              {errors.sample && (
                <span className="text-red-500 text-xs ml-2">{errors.sample}</span>
              )}
            </label>
            <textarea
              name="sample"
              value={formData.sample || ''}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px]
                ${errors.sample ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter sample details"
            />
          </div>

          {/* Biopsy Specific Fields */}
          {formData.reportType === 'Biopsy' && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Histopathological Diagnosis
                  {errors.histopathologicalDiagnosis && (
                    <span className="text-red-500 text-xs ml-2">{errors.histopathologicalDiagnosis}</span>
                  )}
                </label>
                <textarea
                  name="histopathologicalDiagnosis"
                  value={formData.histopathologicalDiagnosis || ''}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px]
                    ${errors.histopathologicalDiagnosis ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter histopathological diagnosis"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Microscopic Examination
                  {errors.microscopicExamination && (
                    <span className="text-red-500 text-xs ml-2">{errors.microscopicExamination}</span>
                  )}
                </label>
                <textarea
                  name="microscopicExamination"
                  value={formData.microscopicExamination || ''}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px]
                    ${errors.microscopicExamination ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter microscopic examination details"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Macroscopic Examination
                  {errors.macroscopicExamination && (
                    <span className="text-red-500 text-xs ml-2">{errors.macroscopicExamination}</span>
                  )}
                </label>
                <textarea
                  name="macroscopicExamination"
                  value={formData.macroscopicExamination || ''}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px]
                    ${errors.macroscopicExamination ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter macroscopic examination details"
                />
              </div>
            </>
          )}

          {/* PapTest and Cytology Specific Fields */}
          {(formData.reportType === 'PapTest' || formData.reportType === 'Cytology' || formData.reportType === 'PapTest2') && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cytological Examination
                {errors.cytologicalExamination && (
                  <span className="text-red-500 text-xs ml-2">{errors.cytologicalExamination}</span>
                )}
              </label>
              <textarea
                name="cytologicalExamination"
                value={formData.cytologicalExamination || ''}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px]
                  ${errors.cytologicalExamination ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter cytological examination details"
              />
            </div>
          )}

          {!formData.reportType && (
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
              <p className="text-gray-500">Please select a report type to view specific fields</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Saving...' : 'Save Template'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DetailsForm;