// components/ViewPatient/PersonalInfoCard.js
import React from 'react';
import { Calendar, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const PersonalInfoCard = ({ patient }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informatat Personale</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {patient.dateOfBirth && (
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Datelindja</p>
              <p className="font-medium">
                {new Date(patient.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Adresa</p>
            <p className="font-medium">{patient.address}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;