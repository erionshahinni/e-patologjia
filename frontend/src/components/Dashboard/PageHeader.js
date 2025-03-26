// components/Dashboard/PageHeader.js
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

const PageHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
          Patient Dashboard
        </h1>
        <p className="mt-2 text-slate-600">Menaxho te dhenat e pacientit</p>
      </div>
      <Link
        to="/add-patient"
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 ease-in-out"
      >
        <PlusCircleIcon className="w-5 h-5 mr-2" />
        Krijo pacient te ri
      </Link>
    </div>
  );
};

export default PageHeader;