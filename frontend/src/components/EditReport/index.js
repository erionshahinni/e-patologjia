// components/EditReport/index.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getReportById, getTemplates } from '../../services/api';
import { ArrowLeft, Activity, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import EditFormWrapper from '../ReportForm/EditFormWrapper';

const EditReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reportResponse, templatesResponse] = await Promise.all([
          getReportById(id),
          getTemplates()
        ]);

        if (reportResponse) {
          setReport(reportResponse);
        }

        setTemplates(templatesResponse || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSuccess = (message) => {
    // Important: Make sure we're using report.patientId, not the report object itself
    console.log('Navigation to patient view with ID:', report.patientId);
    if (report && report.patientId) {
      // Ensure we're using a string ID, not an object
      const patientId = typeof report.patientId === 'object' ? 
                        (report.patientId._id || report.patientId.id || '') : 
                        report.patientId;
      
      navigate(`/view-patient/${patientId}`);
    } else {
      navigate('/');
    }
  };

  const handleError = (message) => {
    setError(message);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="h-12 w-12 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Report not found</p>
            <Link to="/" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
              Return to Dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto p-6 space-y-6 flex-grow">
        {/* Ensure we're using report.patientId here as well, not the entire object */}
        <Link
          to={`/view-patient/${typeof report.patientId === 'object' ? (report.patientId._id || report.patientId.id || '') : report.patientId}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patient
        </Link>

        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Report</h1>
            <p className="text-gray-500">Report ID: {report._id}</p>
          </div>
        </div>

        <EditFormWrapper
          patientId={report.patientId}
          selectedReport={report}
          templates={templates}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
};

export default EditReport;