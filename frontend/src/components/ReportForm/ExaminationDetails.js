// components/ReportForm/ExaminationDetails.js
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Save, CheckCircle2 } from 'lucide-react';
import Button from '../ui/button';
import PapTest2Form from './PapTest2Form';

const ExaminationDetails = ({ formData, handleChange, handlePapTest2Change, handleSubmit }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Examination Details</CardTitle>
        <CardDescription>Enter medical examination details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Report Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Report Type</label>
            <select
              name="reportType"
              value={formData.reportType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Zgjedh llojin e raportit</option>
              <option value="Biopsy">Biopsy</option>
              <option value="PapTest">Pap Test</option>
              <option value="PapTest2">Pap Test 2</option>
              <option value="Cytology">Cytology</option>
            </select>
          </div>

          {/* Diagnosis - required for ALL report types */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 font-bold">
              Diagnosis <span className="text-red-500">*</span>
            </label>
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px]"
              placeholder="Enter diagnosis"
            />
            <p className="text-xs text-gray-500">
              Required for all report types
            </p>
          </div>

          {/* Sample field - only for Biopsy, PapTest and Cytology report types */}
          {(formData.reportType === 'Biopsy' || formData.reportType === 'PapTest' || formData.reportType === 'Cytology') && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 font-bold">
                Sample <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sample"
                value={formData.sample}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter sample description"
              />
              <p className="text-xs text-gray-500">
                Required for {formData.reportType} reports
              </p>
            </div>
          )}

          {!formData.reportType && (
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
              <p className="text-gray-500">Please select a report type to view specific fields</p>
            </div>
          )}

          {/* Biopsy Specific Fields */}
          {formData.reportType === 'Biopsy' && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Diagnoza histopatologjike <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="histopathologicalDiagnosis"
                  value={formData.histopathologicalDiagnosis}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px]"
                  placeholder="Enter histopathological diagnosis"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ekzaminimi mikroskopik <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="microscopicExamination"
                  value={formData.microscopicExamination}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px]"
                  placeholder="Enter microscopic examination details"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ekzaminimi makroskopik <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="macroscopicExamination"
                  value={formData.macroscopicExamination}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px]"
                  placeholder="Enter macroscopic examination details"
                />
              </div>
            </>
          )}

          {/* PapTest and Cytology Specific Fields */}
          {(formData.reportType === 'PapTest' || formData.reportType === 'Cytology') && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Ekzaminimi citologjik <span className="text-red-500">*</span>
              </label>
              <textarea
                name="cytologicalExamination"
                value={formData.cytologicalExamination}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px]"
                placeholder="Enter cytological examination details"
              />
            </div>
          )}

          {/* PapTest2 Specific Fields */}
          {formData.reportType === 'PapTest2' && (
            <PapTest2Form
              formData={formData}
              handleChange={handleChange}
              handlePapTest2Change={handlePapTest2Change}
              readOnly={false}
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSubmit('Controlled')}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save as Controlled
        </Button>
        <Button
          type="button"
          onClick={() => handleSubmit('Completed')}
          className="flex items-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          Complete Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExaminationDetails;