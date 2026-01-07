// components/Dashboard/PageHeader.js
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Users } from 'lucide-react';

const PageHeader = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Patient Dashboard</h1>
            <p className="text-gray-600 mt-1">Menaxho te dhenat e pacientit</p>
          </div>
        </div>
        <Link
          to="/add-patient"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Krijo pacient te ri
        </Link>
      </div>
    </div>
  );
};

export default PageHeader;