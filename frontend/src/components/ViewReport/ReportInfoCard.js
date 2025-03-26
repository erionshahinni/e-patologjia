// components/ViewReport/ReportInfoCard.js
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import Badge from '../ui/badge';

const ReportInfoCard = ({ report, isPriceVisible, togglePriceVisibility }) => {
  // Helper function to determine payment status color
  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  // Payment Status Display Component
  const PaymentStatusDisplay = () => (
    <div>
      <p className="text-sm font-medium text-gray-500">Payment Status</p>
      <div className="mt-1">
        <Badge className={getPaymentStatusColor(report.paymentStatus)}>
          {getPaymentStatusText(report.paymentStatus)}
        </Badge>
      </div>
    </div>
  );

  // Parse referring doctors safely
  const getReferringDoctorsList = () => {
    try {
      const additionalDoctors = JSON.parse(report.referringDoctors);
      if (Array.isArray(additionalDoctors) && additionalDoctors.length > 0) {
        return (
          <ul className="list-disc pl-5">
            {additionalDoctors.map((doctor, index) => (
              <li key={index}>{doctor}</li>
            ))}
          </ul>
        );
      }
      return <p className="text-gray-500 italic">Asnje mjek shtese</p>;
    } catch (error) {
      console.error("Error parsing referringDoctors:", error);
      return <p className="text-gray-500 italic">Asnje mjek shtese</p>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Information</CardTitle>
        <CardDescription>Clinical details and diagnoses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Referenca</p>
          <p className="mt-1">{report.referenceNumber}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Institucioni Shendetesor</p>
          <p className="mt-1">{report.healthcareInstitution}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Adresa e Institucionit</p>
          <p className="mt-1">{report.institutionAddress || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Mjeku udhezues kryesor</p>
          <p className="mt-1">{report.referringDoctor || 'N/A'}</p>
        </div>

        {/* Show additional referring doctors if available */}
        {report.referringDoctors && (
          <div>
            <p className="text-sm font-medium text-gray-500">Mjeke udhezues shtese</p>
            <div className="mt-1">
              {getReferringDoctorsList()}
            </div>
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-gray-500">Cmimi</p>
          <p
            className="mt-1 cursor-pointer select-none"
            onClick={togglePriceVisibility}
            title={isPriceVisible ? 'Click to hide' : 'Click to show'}
          >
            {isPriceVisible ? report.price : '****'}
          </p>
        </div>
        <PaymentStatusDisplay />
        {report.finishedAt && (
          <div>
            <p className="text-sm font-medium text-gray-500">Finished At</p>
            <p className="mt-1">{new Date(report.finishedAt).toLocaleDateString()}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportInfoCard;