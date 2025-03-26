// components/ViewPatient/MedicalInfoCard.js
import React from 'react';
import { Building2, UserCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const MedicalInfoCard = ({ latestReport }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informatat Mjekësore</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Institucioni Shëndetësor</p>
            <p className="font-medium">{latestReport.healthcareInstitution}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <UserCircle className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Mjeku Udhëzues</p>
            <p className="font-medium">{latestReport.referringDoctor}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalInfoCard;