// components/ViewReport/ReportHeader.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Edit, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const ReportHeader = ({ report, onDelete }) => {
  const getStatusBadge = (status) => {
    const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';
    switch (status?.toLowerCase()) {
      case 'completed':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Completed
          </span>
        );
      case 'controlled':
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            <Clock className="w-4 h-4 mr-2" />
            Controlled
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            <AlertCircle className="w-4 h-4 mr-2" />
            {status || 'Not Created'}
          </span>
        );
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {report.reportType} Report
            </h1>
            <p className="text-sm text-gray-500">
              Created on {new Date(report.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {getStatusBadge(report.status)}
          <div className="flex gap-2">
            <Link
              to={`/edit-report/${report._id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Report
            </Link>
            <button
              onClick={onDelete}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;