// components/ViewReport/MedicalExaminationCard.js
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Stethoscope, Microscope, Eye, FlaskConical, FileText } from 'lucide-react';

const MedicalExaminationCard = ({ report }) => {
  const SectionItem = ({ icon: Icon, label, value, isLast = false }) => (
    <div className={`${!isLast ? 'pb-6 mb-6 border-b border-gray-100' : ''}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Icon className="h-4 w-4 text-indigo-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            {label}
          </p>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere text-gray-900">
            {value || <span className="text-gray-400 italic">N/A</span>}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="mt-6 lg:col-span-2 shadow-sm border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Stethoscope className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Medical Examination</CardTitle>
            <CardDescription className="mt-1">Clinical diagnosis and examination details</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-0">
          <SectionItem 
            icon={FileText} 
            label="Clinical Diagnosis" 
            value={report.diagnosis}
          />

          {report.reportType === 'Biopsy' && (
            <>
              <SectionItem 
                icon={FileText} 
                label="Histopathological Diagnosis" 
                value={report.histopathologicalDiagnosis}
              />
              <SectionItem 
                icon={Microscope} 
                label="Microscopic Examination" 
                value={report.microscopicExamination}
              />
              <SectionItem 
                icon={Eye} 
                label="Macroscopic Examination" 
                value={report.macroscopicExamination}
              />
            </>
          )}

          {(report.reportType === 'PapTest' || report.reportType === 'Cytology') && (
            <SectionItem 
              icon={Microscope} 
              label="Cytological Examination" 
              value={report.cytologicalExamination}
            />
          )}

          <SectionItem 
            icon={FlaskConical} 
            label="Sample" 
            value={report.sample}
            isLast={true}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalExaminationCard;