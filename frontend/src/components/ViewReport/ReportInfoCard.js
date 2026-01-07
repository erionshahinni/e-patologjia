// components/ViewReport/ReportInfoCard.js
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import Badge from '../ui/badge';
import { FileText, Building2, MapPin, UserCheck, Users, DollarSign, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const ReportInfoCard = ({ report, isPriceVisible, togglePriceVisibility }) => {
  // Helper function to determine payment status color
  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unpaid':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper function to get payment status text
  const getPaymentStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'Paguar';
      case 'pending':
        return 'Ne pritje';
      case 'unpaid':
        return 'Pa paguar';
      default:
        return status || 'N/A';
    }
  };

  // Parse referring doctors safely
  const getReferringDoctorsList = () => {
    try {
      const additionalDoctors = JSON.parse(report.referringDoctors);
      if (Array.isArray(additionalDoctors) && additionalDoctors.length > 0) {
        return (
          <ul className="list-disc pl-5 space-y-1">
            {additionalDoctors.map((doctor, index) => (
              <li key={index} className="text-sm text-gray-700">{doctor}</li>
            ))}
          </ul>
        );
      }
      return <p className="text-sm text-gray-400 italic">Asnje mjek shtese</p>;
    } catch (error) {
      console.error("Error parsing referringDoctors:", error);
      return <p className="text-sm text-gray-400 italic">Asnje mjek shtese</p>;
    }
  };

  const InfoItem = ({ icon: Icon, label, value, isLast = false }) => (
    <div className={`${!isLast ? 'pb-4 mb-4 border-b border-gray-100' : ''}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Icon className="h-4 w-4 text-purple-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            {label}
          </p>
          <div className="text-sm font-medium text-gray-900">
            {value}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FileText className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Report Information</CardTitle>
            <CardDescription className="mt-1">Clinical details and diagnoses</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-0">
          <InfoItem 
            icon={FileText}
            label="Referenca"
            value={report.referenceNumber || 'N/A'}
          />
          <InfoItem 
            icon={Building2}
            label="Institucioni Shendetesor"
            value={report.healthcareInstitution || 'N/A'}
          />
          <InfoItem 
            icon={MapPin}
            label="Adresa e Institucionit"
            value={report.institutionAddress || 'N/A'}
          />
          <InfoItem 
            icon={UserCheck}
            label="Mjeku udhezues kryesor"
            value={report.referringDoctor || 'N/A'}
          />

          {report.referringDoctors && (
            <div className="pb-4 mb-4 border-b border-gray-100">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Mjeke udhezues shtese
                  </p>
                  <div className="text-sm text-gray-900">
                    {getReferringDoctorsList()}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pb-4 mb-4 border-b border-gray-100">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Cmimi
                </p>
                <div 
                  className="flex items-center space-x-2 cursor-pointer group"
                  onClick={togglePriceVisibility}
                  title={isPriceVisible ? 'Click to hide' : 'Click to show'}
                >
                  <p className="text-sm font-medium text-gray-900">
                    {isPriceVisible ? `${report.price} €` : '****'}
                  </p>
                  {isPriceVisible ? (
                    <EyeOff className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pb-4 mb-4 border-b border-gray-100">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Payment Status
                </p>
                <Badge className={`${getPaymentStatusColor(report.paymentStatus)} border font-medium px-3 py-1`}>
                  {getPaymentStatusText(report.paymentStatus)}
                </Badge>
              </div>
            </div>
          </div>

          {report.finishedAt && (
            <InfoItem 
              icon={CheckCircle2}
              label="Finished At"
              value={new Date(report.finishedAt).toLocaleDateString()}
              isLast={true}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportInfoCard;