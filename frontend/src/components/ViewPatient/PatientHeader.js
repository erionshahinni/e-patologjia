// components/ViewPatient/PatientHeader.js
import React from 'react';
import { User, Plus } from "lucide-react";
import { Link } from 'react-router-dom';
import Button from "../ui/button";

const PatientHeader = ({ patient, latestReport }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {`${patient.firstName} ${patient.lastName}`}
          </h1>
          {latestReport && (
            <p className="text-gray-500">Referenca #{latestReport.referenceNumber}</p>
          )}
        </div>
      </div>
      <div className="flex gap-3">
        <Link to={`/edit-patient/${patient._id}`}>
          <Button variant="outline">Ndrysho Pacientin</Button>
        </Link>
        <Link to={`/add-report/${patient._id}`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Shto Raport
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PatientHeader;