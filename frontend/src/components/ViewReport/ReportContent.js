// components/ViewReport/ReportContent.js
import React, { useState } from 'react';
import { User, Calendar, Building2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import PatientInfoCard from './PatientInfoCard';
import ReportInfoCard from './ReportInfoCard';
import PapTest2Card from './PapTest2Card';
import MedicalExaminationCard from './MedicalExaminationCard';

const ReportContent = ({ report }) => {
  const [isPriceVisible, setIsPriceVisible] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Patient Information Card */}
      <PatientInfoCard patient={report.patientId} />

      {/* Report Information Card */}
      <ReportInfoCard 
        report={report} 
        isPriceVisible={isPriceVisible}
        togglePriceVisibility={() => setIsPriceVisible(!isPriceVisible)}
      />

      {/* PapTest2 Details Card (if applicable) */}
      {report.reportType === 'PapTest2' && (
        <PapTest2Card 
          reportType={report.reportType} 
          paptest2Data={report.paptest2Data} 
        />
      )}

      {/* Medical Examination Card */}
      <MedicalExaminationCard report={report} />
    </div>
  );
};

export default ReportContent;