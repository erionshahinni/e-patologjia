// components/EditPatient/ReportsList.js
import React, { useState } from 'react';
import { CheckCircleIcon, Trash, Edit, FileText, Calendar, Hash } from 'lucide-react';
import DeleteReportModal from '../ReportForm/DeleteReportModal';
import { Card, CardContent } from '../ui/card';
import Badge from '../ui/badge';

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Controlled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Not Created':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card className="shadow-sm border border-gray-200 mt-6">
      <CardContent className="p-0">
        {reports && reports.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {reports.map((report) => (
              <div key={report._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`flex-shrink-0 p-3 rounded-lg ${
                      report.status === 'Completed' ? 'bg-green-50' : 
                      report.status === 'Controlled' ? 'bg-yellow-50' : 'bg-blue-50'
                    }`}>
                      <FileText className={`h-6 w-6 ${
                        report.status === 'Completed' ? 'text-green-600' : 
                        report.status === 'Controlled' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {report.reportType || 'Report'}
                        </h4>
                        <Badge className={`${getStatusColor(report.status)} border font-medium px-2 py-1`}>
                          {report.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        {report.referenceNumber && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Hash className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">Reference:</span>
                            <span>{report.referenceNumber}</span>
                          </div>
                        )}
                        {report.finishedAt && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">Finished:</span>
                            <span>{new Date(report.finishedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onEditReport(report)}
                      className="inline-flex items-center px-4 py-2 border border-indigo-300 text-sm font-medium rounded-lg text-indigo-700 bg-white hover:bg-indigo-50 transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(report._id)}
                      className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 transition-colors"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-500">No reports available</p>
            <p className="text-xs text-gray-400 mt-1">Add a new report to get started</p>
          </div>
        )}

        {/* Delete Report Modal */}
        <DeleteReportModal
          isOpen={isDeleteModalOpen}
          closeModal={handleCloseDeleteModal}
          reportId={selectedReportId}
          onSuccess={handleDeleteSuccess}
        />
      </CardContent>
    </Card>
  );
};

export default ReportsList;