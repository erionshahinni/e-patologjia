// components/TemplateForm/DetailsForm.js
import React, { memo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Save, Stethoscope, FlaskConical, Microscope, Eye, ClipboardList } from 'lucide-react';
import Button from '../ui/button';

// FormField component moved outside to prevent re-creation on each render
const TextAreaField = memo(({ icon: Icon, label, name, value, onChange, error, placeholder, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
      <Icon className="h-4 w-4 text-indigo-600" />
      <span>{label}</span>
      {error && (
        <span className="text-red-500 text-xs font-normal ml-2">{error}</span>
      )}
    </label>
    <textarea
      name={name}
      value={value || ''}
      onChange={onChange}
      className={`mt-1 block w-full rounded-lg border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 min-h-[120px] transition-colors ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      placeholder={placeholder}
    />
  </div>
));

const DetailsForm = ({ formData, handleChange, handleSubmit, errors = {}, isSubmitting = false }) => {
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Stethoscope className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Examination Details</CardTitle>
            <CardDescription className="mt-1">Enter template content based on report type</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Common Field: Diagnosis */}
          <TextAreaField
            icon={ClipboardList}
            label="Diagnosis"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            error={errors.diagnosis}
            placeholder="Enter diagnosis details"
          />

          {/* Common Field: Sample */}
          <TextAreaField
            icon={FlaskConical}
            label="Sample"
            name="sample"
            value={formData.sample}
            onChange={handleChange}
            error={errors.sample}
            placeholder="Enter sample details"
          />

          {/* Biopsy Specific Fields */}
          {formData.reportType === 'Biopsy' && (
            <>
              <TextAreaField
                icon={ClipboardList}
                label="Histopathological Diagnosis"
                name="histopathologicalDiagnosis"
                value={formData.histopathologicalDiagnosis}
                onChange={handleChange}
                error={errors.histopathologicalDiagnosis}
                placeholder="Enter histopathological diagnosis"
              />

              <TextAreaField
                icon={Microscope}
                label="Microscopic Examination"
                name="microscopicExamination"
                value={formData.microscopicExamination}
                onChange={handleChange}
                error={errors.microscopicExamination}
                placeholder="Enter microscopic examination details"
              />

              <TextAreaField
                icon={Eye}
                label="Macroscopic Examination"
                name="macroscopicExamination"
                value={formData.macroscopicExamination}
                onChange={handleChange}
                error={errors.macroscopicExamination}
                placeholder="Enter macroscopic examination details"
              />
            </>
          )}

          {/* PapTest and Cytology Specific Fields */}
          {(formData.reportType === 'PapTest' || formData.reportType === 'Cytology' || formData.reportType === 'PapTest2') && (
            <TextAreaField
              icon={Microscope}
              label="Cytological Examination"
              name="cytologicalExamination"
              value={formData.cytologicalExamination}
              onChange={handleChange}
              error={errors.cytologicalExamination}
              placeholder="Enter cytological examination details"
            />
          )}

          {!formData.reportType && (
            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 text-center">
              <p className="text-gray-500 font-medium">Please select a report type to view specific fields</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-4 border-t border-gray-200">
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-sm transition-all"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Saving...' : 'Save Template'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DetailsForm;