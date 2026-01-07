// components/ReportForm/ExaminationDetails.js
import React, { useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Save, CheckCircle2, Stethoscope, FileText, Microscope, Eye, FlaskConical, ClipboardList } from 'lucide-react';
import Button from '../ui/button';
import PapTest2Form from './PapTest2Form';

// Helper function to auto-resize textarea
const useAutoResize = (value) => {
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Set height to scrollHeight, with minimum of 120px
      textarea.style.height = `${Math.max(120, textarea.scrollHeight)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  // Also adjust on input for real-time resizing
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('input', adjustHeight);
      return () => textarea.removeEventListener('input', adjustHeight);
    }
  }, []);

  return textareaRef;
};

const ExaminationDetails = ({ formData, handleChange, handlePapTest2Change, handleSubmit }) => {
  // Refs for auto-resizing textareas
  const diagnosisRef = useAutoResize(formData.diagnosis);
  const histopathologicalDiagnosisRef = useAutoResize(formData.histopathologicalDiagnosis);
  const microscopicExaminationRef = useAutoResize(formData.microscopicExamination);
  const macroscopicExaminationRef = useAutoResize(formData.macroscopicExamination);
  const cytologicalExaminationRef = useAutoResize(formData.cytologicalExamination);

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Stethoscope className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Examination Details</CardTitle>
            <CardDescription className="mt-1">Enter medical examination details</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Report Type */}
          <div className="space-y-2 pb-4 border-b border-gray-100">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <ClipboardList className="h-4 w-4 text-indigo-600" />
              <span>Report Type</span>
            </label>
            <select
              name="reportType"
              value={formData.reportType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 bg-white border transition-colors"
            >
              <option value="">Zgjedh llojin e raportit</option>
              <option value="Biopsy">Biopsy</option>
              <option value="PapTest">Pap Test</option>
              <option value="PapTest2">Pap Test 2</option>
              <option value="Cytology">Cytology</option>
            </select>
          </div>

          {/* Diagnosis - required for ALL report types */}
          <div className="space-y-2 pb-4 border-b border-gray-100">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <FileText className="h-4 w-4 text-indigo-600" />
              <span>Diagnoza Klinike <span className="text-red-500">*</span></span>
            </label>
            <textarea
              ref={diagnosisRef}
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px] resize-none overflow-hidden px-3 py-2 border transition-colors"
              placeholder="Enter diagnosis"
              style={{ minHeight: '120px' }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Required for all report types
            </p>
          </div>

          {/* Sample field - only for Biopsy, PapTest and Cytology report types */}
          {(formData.reportType === 'Biopsy' || formData.reportType === 'PapTest' || formData.reportType === 'Cytology') && (
            <div className="space-y-2 pb-4 border-b border-gray-100">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <FlaskConical className="h-4 w-4 text-indigo-600" />
                <span>Mostra <span className="text-red-500">*</span></span>
              </label>
              <input
                type="text"
                name="sample"
                value={formData.sample}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border transition-colors"
                placeholder="Enter sample description"
              />
              <p className="text-xs text-gray-500 mt-1">
                Required for {formData.reportType} reports
              </p>
            </div>
          )}

          {!formData.reportType && (
            <div className="p-6 border border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 text-center">
              <Stethoscope className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Please select a report type to view specific fields</p>
            </div>
          )}

          {/* Biopsy Specific Fields */}
          {formData.reportType === 'Biopsy' && (
            <>
              <div className="space-y-2 pb-4 border-b border-gray-100">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  <span>Diagnoza histopatologjike <span className="text-red-500">*</span></span>
                </label>
                <textarea
                  ref={histopathologicalDiagnosisRef}
                  name="histopathologicalDiagnosis"
                  value={formData.histopathologicalDiagnosis}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px] resize-none overflow-hidden px-3 py-2 border transition-colors"
                  placeholder="Enter histopathological diagnosis"
                  style={{ minHeight: '120px' }}
                />
              </div>

              <div className="space-y-2 pb-4 border-b border-gray-100">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Microscope className="h-4 w-4 text-indigo-600" />
                  <span>Ekzaminimi mikroskopik <span className="text-red-500">*</span></span>
                </label>
                <textarea
                  ref={microscopicExaminationRef}
                  name="microscopicExamination"
                  value={formData.microscopicExamination}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px] resize-none overflow-hidden px-3 py-2 border transition-colors"
                  placeholder="Enter microscopic examination details"
                  style={{ minHeight: '120px' }}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Eye className="h-4 w-4 text-indigo-600" />
                  <span>Ekzaminimi makroskopik <span className="text-red-500">*</span></span>
                </label>
                <textarea
                  ref={macroscopicExaminationRef}
                  name="macroscopicExamination"
                  value={formData.macroscopicExamination}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px] resize-none overflow-hidden px-3 py-2 border transition-colors"
                  placeholder="Enter macroscopic examination details"
                  style={{ minHeight: '120px' }}
                />
              </div>
            </>
          )}

          {/* PapTest and Cytology Specific Fields */}
          {(formData.reportType === 'PapTest' || formData.reportType === 'Cytology') && (
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Microscope className="h-4 w-4 text-indigo-600" />
                <span>Ekzaminimi citologjik <span className="text-red-500">*</span></span>
              </label>
              <textarea
                ref={cytologicalExaminationRef}
                name="cytologicalExamination"
                value={formData.cytologicalExamination}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px] resize-none overflow-hidden px-3 py-2 border transition-colors"
                placeholder="Enter cytological examination details"
                style={{ minHeight: '120px' }}
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
      <CardFooter className="flex justify-end space-x-4 bg-gray-50 border-t border-gray-200 px-6 py-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSubmit('Controlled')}
          className="flex items-center gap-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50"
        >
          <Save className="h-4 w-4" />
          Save as Controlled
        </Button>
        <Button
          type="button"
          onClick={() => handleSubmit('Completed')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
        >
          <CheckCircle2 className="h-4 w-4" />
          Complete Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExaminationDetails;