// components/Dashboard/QuickStats.js
import React from 'react';

const QuickStats = ({ patients }) => {
  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      <div className="bg-white rounded-lg shadow-lg p-4 border border-slate-100">
        <div className="text-sm text-slate-600">
          <div className="font-medium">Statistikat:</div>
          <div>Total pacientë: {patients.length}</div>
          <div>
            Me raporte: {patients.filter(p => p.reports && p.reports.length > 0).length}
          </div>
          <div>
            Pa raporte: {patients.filter(p => !p.reports || p.reports.length === 0).length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;