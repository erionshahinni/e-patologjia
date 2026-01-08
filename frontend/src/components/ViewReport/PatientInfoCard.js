// components/ViewReport/PatientInfoCard.js
import React from 'react';
import { User, Calendar, Building2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

const PatientInfoCard = ({ patient }) => {
  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0 mt-0.5">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="h-4 w-4 text-blue-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Patient Information</CardTitle>
            <CardDescription className="mt-1">Details of the patient associated with this report</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-0">
          <InfoItem 
            icon={User}
            label="Patient Name"
            value={`${patient.firstName} ${patient.lastName}`}
          />
          {patient.dateOfBirth && (
            <InfoItem 
              icon={Calendar}
              label="Date of Birth"
              value={new Date(patient.dateOfBirth).toLocaleDateString()}
            />
          )}
          <InfoItem 
            icon={Building2}
            label="Gjinia"
            value={patient.gender}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInfoCard;