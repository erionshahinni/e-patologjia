// components/EditPatient/index.js
import React, { useEffect, useState } from 'react';
import { 
  getPatientById, 
  updatePatient, 
  getReportsByPatientId,
  getTemplates
} from '../../services/api';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  UserCircle,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Button from "../ui/button";
import PatientInfoForm from './PatientInfoForm';
import ReportsList from './ReportsList';
import EditFormWrapper from '../ReportForm/EditFormWrapper';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';

const EditPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState([]);
  
  // Dialog states
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Patient-specific data - initialize with empty values
  const [patientData, setPatientData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    address: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [patientResponse, reportsResponse, templatesResponse] = await Promise.all([
          getPatientById(id),
          getReportsByPatientId(id),
          getTemplates()
        ]);
        
        if (patientResponse) {
          setPatientData(patientResponse);
        }
        
        setReports(reportsResponse || []);
        setTemplates(templatesResponse || []);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setModalMessage('Failed to load necessary data');
        setIsErrorModalOpen(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePatient(id, patientData);
      setModalMessage('Patient updated successfully');
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Error updating patient:', error);
      setModalMessage('Failed to update patient');
      setIsErrorModalOpen(true);
    }
  };

  const handleReportSuccess = async (message) => {
    setModalMessage(message);
    setIsSuccessModalOpen(true);
    
    // Refresh the reports list
    try {
      const reportsResponse = await getReportsByPatientId(id);
      setReports(reportsResponse || []);
    } catch (error) {
      console.error('Error refreshing reports:', error);
    }
    
    // Reset form and state
    setShowReportForm(false);
    setSelectedReport(null);
  };

  const handleReportDeleted = async () => {
    // Refresh the reports list
    try {
      const reportsResponse = await getReportsByPatientId(id);
      setReports(reportsResponse || []);
      setModalMessage('Report deleted successfully');
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Error refreshing reports:', error);
      setModalMessage('Error refreshing reports after deletion');
      setIsErrorModalOpen(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="h-12 w-12 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto p-6 space-y-6 flex-grow">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <UserCircle className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edito Pacientin</h1>
              <p className="text-gray-500">
                {patientData ? `${patientData.firstName} ${patientData.lastName}` : 'Loading...'}
              </p>
            </div>
          </div>
        </div>

        {/* Patient Form */}
        <PatientInfoForm 
          patientData={patientData} 
          handleChange={handlePatientChange} 
          handleSubmit={handlePatientSubmit} 
        />

        {/* Reports Section */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
            <Button
              onClick={() => {
                setShowReportForm(!showReportForm);
                setSelectedReport(null);
              }}
            >
              {showReportForm ? 'Cancel' : 'Add New Report'}
            </Button>
          </div>

          {showReportForm && (
            <EditFormWrapper 
              patientId={id} 
              selectedReport={selectedReport}
              templates={templates}
              onSuccess={handleReportSuccess}
            />
          )}

          {/* Reports List */}
          <ReportsList
            reports={reports}
            onEditReport={(report) => {
              setSelectedReport(report);
              setShowReportForm(true);
            }}
            onReportDeleted={handleReportDeleted}
          />
        </div>
      </div>

      {/* Success dialog */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        message={modalMessage}
      />

      {/* Error dialog */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        message={modalMessage}
      />
    </div>
  );
};

export default EditPatient;