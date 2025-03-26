// components/ViewPatient/index.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPatientById, getReportsByPatientId, deleteReport } from '../../services/api';
import { ArrowLeft, User, Activity } from "lucide-react";
import PatientHeader from './PatientHeader';
import PatientTabs from './PatientTabs';
import DeleteReportModal from './DeleteReportModal';

const ViewPatient = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [error, setError] = useState(null);
  const [latestReport, setLatestReport] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [patientResponse, reportsResponse] = await Promise.all([
          getPatientById(id),
          getReportsByPatientId(id)
        ]);
        
        if (patientResponse) {
          setPatient(patientResponse);
        }
        
        // Ensure reports is always an array
        const reportsList = reportsResponse || [];
        setReports(reportsList);
        
        // Set the latest report if there are any reports
        if (reportsList.length > 0) {
          setLatestReport(reportsList[0]);
        }
        
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleDeleteClick = (reportId) => {
    setSelectedReportId(reportId);
    setIsDeleteModalOpen(true);
    setError(null);
  };

  const handleDeleteConfirm = async (pin) => {
    if (!selectedReportId) return;
    
    try {
      setDeleteLoading(true);
      setError(null);
      
      console.log(`Attempting to delete report with ID: ${selectedReportId}`);
      
      // Call the API with the PIN
      await deleteReport(selectedReportId, pin);
      
      // Update the UI by removing the deleted report
      setReports(reports.filter(report => report._id !== selectedReportId));
      
      // If we deleted the latest report, update latestReport
      if (latestReport && latestReport._id === selectedReportId) {
        const newLatestReport = reports.find(report => report._id !== selectedReportId);
        setLatestReport(newLatestReport || null);
      }
      
      // Close the modal
      setIsDeleteModalOpen(false);
      setSelectedReportId(null);
      
    } catch (error) {
      console.error('Error deleting report:', error);
      setError(error.message || 'Failed to delete report');
      throw error; // Rethrow to be handled by the modal component
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="h-12 w-12 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!patient) {
    return <div>Error loading patient data.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto p-6 space-y-6 flex-grow">
        {/* Back Navigation */}
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kthehu në Dashboard
        </Link>

        {/* Patient Header */}
        <PatientHeader patient={patient} latestReport={latestReport} />

        {/* Main Content Tabs */}
        <PatientTabs 
          patient={patient} 
          reports={reports} 
          latestReport={latestReport} 
          onDeleteReport={handleDeleteClick} 
        />

        {/* Delete Confirmation Modal */}
        <DeleteReportModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          error={error}
        />
      </div>
    </div>
  );
};

export default ViewPatient;