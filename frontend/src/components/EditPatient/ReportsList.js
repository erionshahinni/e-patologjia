// components/EditPatient/ReportsList.js
import React, { useState } from 'react';
import { CheckCircleIcon, Trash } from 'lucide-react';
import DeleteReportModal from '../ReportForm/DeleteReportModal';

const ReportsList = ({ reports = [], onEditReport, onReportDeleted }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  const handleOpenDeleteModal = (reportId) => {
    setSelectedReportId(reportId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedReportId(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteSuccess = () => {
    // Notify parent component that a report was deleted
    if (onReportDeleted) {
      onReportDeleted(selectedReportId);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md mt-6">
      {reports && reports.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {reports.map((report) => (
            <li key={report._id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      report.status === 'Completed' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <CheckCircleIcon className={`h-5 w-5 ${
                        report.status === 'Completed' ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">
                      {report.reportType}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Status: {report.status}
                    </p>
                    <p className="text-sm text-gray-500">
                      Reference: {report.referenceNumber}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditReport(report)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(report._id)}
                    className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                  >
                    <Trash className="h-3 w-3 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">No reports available</p>
        </div>
      )}

      {/* Delete Report Modal */}
      <DeleteReportModal
        isOpen={isDeleteModalOpen}
        closeModal={handleCloseDeleteModal}
        reportId={selectedReportId}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
};

export default ReportsList;