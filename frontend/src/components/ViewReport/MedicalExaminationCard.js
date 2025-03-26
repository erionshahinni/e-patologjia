// components/ViewReport/MedicalExaminationCard.js
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

const MedicalExaminationCard = ({ report }) => {
  return (
    <Card className="mt-6 lg:col-span-2">
      <CardHeader>
        <CardTitle>Medical Examination</CardTitle>
        <CardDescription>Clinical diagnosis and examination details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm font-medium text-gray-500">Clinical Diagnosis</p>
          <p className="mt-1 whitespace-pre-wrap">{report.diagnosis}</p>
        </div>

        {report.reportType === 'Biopsy' && (
          <>
            <div>
              <p className="text-sm font-medium text-gray-500">Histopathological Diagnosis</p>
              <p className="mt-1 whitespace-pre-wrap">{report.histopathologicalDiagnosis}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Microscopic Examination</p>
              <p className="mt-1 whitespace-pre-wrap">{report.microscopicExamination}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Macroscopic Examination</p>
              <p className="mt-1 whitespace-pre-wrap">{report.macroscopicExamination}</p>
            </div>
          </>
        )}

        {(report.reportType === 'PapTest' || report.reportType === 'Cytology') && (
          <div>
            <p className="text-sm font-medium text-gray-500">Cytological Examination</p>
            <p className="mt-1 whitespace-pre-wrap">{report.cytologicalExamination}</p>
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-gray-500">Sample</p>
          <p className="mt-1">{report.sample}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalExaminationCard;