// components/Dashboard/PatientTable.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Edit, Eye, Plus, FileText, Users } from 'lucide-react';
import { getStatusColor, getGenderIcon } from './utils';

const PatientTable = ({ filteredPatients, openModal, canDelete = true }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Pacienti</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Datelindja</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Gjinia</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Adresa</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Raportet</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Statusi</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredPatients.map((patient) => {
              const latestReport = patient.reports && patient.reports.length > 0 
                ? patient.reports[0] 
                : null;

              return (
                <tr key={patient._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {getGenderIcon(patient.gender)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </div>
                        {latestReport && latestReport.referenceNumber && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            Ref: #{latestReport.referenceNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : '-'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {patient.gender}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {patient.address}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {latestReport ? (
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                          <FileText className="w-3 h-3 mr-1" />
                          {latestReport.reportType}
                        </span>
                        {patient.reports.length > 1 && (
                          <span className="text-xs text-gray-500">
                            +{patient.reports.length - 1} raporte të tjera
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No reports</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(latestReport)}`}>
                      {latestReport?.status || 'No Status'}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/edit-patient/${patient._id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit Patient"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/view-patient/${patient._id}`}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                        title="View Patient"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/add-report/${patient._id}`}
                        className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors duration-200"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Shto Raport
                      </Link>
                      {/* Only show delete button if user has permission */}
                      {canDelete && (
                        <button
                          onClick={() => openModal(patient._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Largo Pacientin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredPatients.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <Users className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-gray-500 font-medium">Nuk u gjet asnjë pacient.</p>
                  </div>
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