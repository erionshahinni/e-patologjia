// components/Dashboard/QuickStats.js
import React from 'react';
import { Users, FileText, FileX } from 'lucide-react';

const QuickStats = ({ patients }) => {
  const totalPatients = patients.length;
  const withReports = patients.filter(p => p.reports && p.reports.length > 0).length;
  const withoutReports = patients.filter(p => !p.reports || p.reports.length === 0).length;

  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <div className="text-sm text-gray-600 space-y-1.5">
          <div className="font-semibold text-gray-700 mb-2">Statistikat:</div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Total pacientë: <span className="font-semibold text-gray-900">{totalPatients}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Me raporte: <span className="font-semibold text-gray-900">{withReports}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <FileX className="w-4 h-4 text-orange-600" />
            <span>Pa raporte: <span className="font-semibold text-gray-900">{withoutReports}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;