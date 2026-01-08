// components/ViewReport/index.js
import React, { useEffect, useState } from 'react';
import { getReportById, deleteReport } from '../../services/api';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import ReportHeader from './ReportHeader';
import ReportContent from './ReportContent';
import PdfPreviewSection from './PdfPreviewSection';
import DeleteReportModal from './DeleteReportModal';
import PdfPreviewModal from './PdfPreviewModal';

const ViewReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [pdfPreviewType, setPdfPreviewType] = useState('electronic'); // 'electronic' or 'physical'
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await getReportById(id);
        setReport(response);
      } catch (error) {
        console.error('Error fetching report:', error);
        setError(error.message || 'Failed to load report data');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleDelete = async (pin) => {
    try {
      setDeleteLoading(true);
      setError(null);
      
      console.log(`Attempting to delete report with ID: ${id}, PIN provided: ${pin ? 'Yes' : 'No'}`);
      
      if (!pin) {
        throw new Error('PIN is required for deletion');
      }
      
      await deleteReport(id, pin);
      
      // Navigate back to patient page on successful deletion
      if (report && report.patientId) {
        const patientId = typeof report.patientId === 'object' ? 
          (report.patientId._id || report.patientId.id) : report.patientId;
        navigate(`/view-patient/${patientId}`);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      setError(error.message || 'Failed to delete report');
      // Re-open the modal to show the error
      setIsDeleteModalOpen(true);
      throw error; // Rethrow to be handled by the modal component
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleShowPDFPreview = (type) => {
    setPdfPreviewType(type);
    setIsPDFModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error && !isDeleteModalOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Error Loading Report</h3>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
              <div className="mt-6">
                <Link to="/dashboard" className="text-blue-600 hover:text-blue-500">
                  Return to Dashboard
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Report Not Found</h3>
              <div className="mt-6">
                <Link to="/dashboard" className="text-blue-600 hover:text-blue-500">
                  Return to Dashboard
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to={`/view-patient/${report.patientId._id}`}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patient Details
          </Link>
        </div>

        {/* Report Header with Actions */}
        <ReportHeader 
          report={report} 
          onDelete={() => setIsDeleteModalOpen(true)} 
        />

        {/* Report Content */}
        <ReportContent report={report} />

        {/* PDF Preview Section */}
        <PdfPreviewSection onPreview={handleShowPDFPreview} />

        {/* Delete Confirmation Modal with PIN verification */}
        <DeleteReportModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />

        {/* PDF Preview Modal */}
        <PdfPreviewModal 
          isOpen={isPDFModalOpen}
          onClose={() => setIsPDFModalOpen(false)}
          report={report}
          previewType={pdfPreviewType}
        />
      </div>
    </div>
  );
};

export default ViewReport;