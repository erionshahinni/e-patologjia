// components/Dashboard/PatientTable.js
import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrashIcon,
  PencilIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { getStatusColor, getGenderIcon } from './utils';

const PatientTable = ({ filteredPatients, openModal, canDelete = true }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-white">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pacienti</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Datelindja</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Gjinia</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Adresa</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Raportet</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Statusi</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredPatients.map((patient) => {
              const latestReport = patient.reports && patient.reports.length > 0 
                ? patient.reports[0] 
                : null;

              return (
                <tr key={patient._id} className="hover:bg-slate-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {getGenderIcon(patient.gender)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">
                          {patient.firstName} {patient.lastName}
                        </div>
                        {latestReport && latestReport.referenceNumber && (
                          <div className="text-xs text-slate-500">
                            Ref: #{latestReport.referenceNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {patient.gender}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {patient.address}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {latestReport ? (
                      <div className="flex flex-col">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {latestReport.reportType}
                        </span>
                        {patient.reports.length > 1 && (
                          <span className="text-xs text-slate-400 mt-1">
                            +{patient.reports.length - 1} more reports
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500">No reports</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(latestReport)}`}>
                      {latestReport?.status || 'No Status'}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-4">
                      <Link
                        to={`/edit-patient/${patient._id}`}
                        className="text-slate-400 hover:text-blue-600 transition-colors duration-200"
                        title="Edit Patient"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/view-patient/${patient._id}`}
                        className="text-slate-400 hover:text-emerald-600 transition-colors duration-200"
                        title="View Patient"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/add-report/${patient._id}`}
                        className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Shto Raport
                      </Link>
                      {/* Only show delete button if user has permission */}
                      {canDelete && (
                        <button
                          onClick={() => openModal(patient._id)}
                          className="text-slate-400 hover:text-red-600 transition-colors duration-200"
                          title="Largo Pacientin"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredPatients.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-slate-500">
                  Nuk u gjet asnjë pacient.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientTable;