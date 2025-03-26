// components/Dashboard/index.js - UPDATED
import React, { useEffect, useState } from 'react';
import { getPatients, deletePatient } from '../../services/api';
import PageHeader from './PageHeader';
import SearchFilterBar from './SearchFilterBar';
import PatientTable from './PatientTable';
import DeleteModal from './DeleteModal';
import QuickStats from './QuickStats';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('none');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterAndSortPatients();
  }, [patients, searchTerm, sortBy]);

  const filterAndSortPatients = () => {
    let result = [...patients];

    if (searchTerm) {
      result = result.filter(patient => {
        const patientName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
        const referenceNumber = patient.reports && patient.reports.length > 0 
          ? patient.reports[0].referenceNumber || ''
          : '';
          
        return patientName.includes(searchTerm.toLowerCase()) || 
               referenceNumber.includes(searchTerm.toLowerCase());
      });
    }

    if (sortBy !== 'none' && result.length > 0) {
      result.sort((a, b) => {
        const latestReportA = a.reports && a.reports.length > 0 ? a.reports[0] : null;
        const latestReportB = b.reports && b.reports.length > 0 ? b.reports[0] : null;

        if (!latestReportA && !latestReportB) return 0;
        if (!latestReportA) return 1;
        if (!latestReportB) return -1;

        switch (sortBy) {
          case 'status':
            return latestReportA.status.localeCompare(latestReportB.status);
          case 'reportType':
            return latestReportA.reportType.localeCompare(latestReportB.reportType);
          case 'institution':
            return latestReportA.healthcareInstitution.localeCompare(latestReportB.healthcareInstitution);
          case 'doctor':
            return latestReportA.referringDoctor.localeCompare(latestReportB.referringDoctor);
          default:
            return 0;
        }
      });
    }

    setFilteredPatients(result);
  };

  const fetchPatients = async () => {
    try {
      const response = await getPatients();
      setPatients(response || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    }
  };

  const handleDelete = async (id, pin) => {
    try {
      setPinError('');
      setIsDeleting(true);
      
      console.log(`Attempting to delete patient with ID: ${id}`);
      
      // Skip PIN verification as a separate step - we'll let the deletePatient API handle it
      // This eliminates one potential failure point
      
      try {
        const response = await deletePatient(id, pin);
        console.log('Delete patient response:', response);
        setDeleteSuccessMessage(response.message || 'Patient deleted successfully');
        await fetchPatients();
        closeModal();
        setPin('');

        // Show success message for 3 seconds
        setTimeout(() => {
          setDeleteSuccessMessage('');
        }, 3000);
      } catch (error) {
        console.error('Patient deletion error:', error);
        // Check response for specific error messages
        if (error.message.includes('Invalid PIN')) {
          setPinError('PIN i gabuar. Ju lutem provoni përsëri.');
        } else if (error.message.includes('No PIN set')) {
          setPinError('Nuk ka PIN të vendosur. Ju lutem vendosni një PIN në Admin Settings.');
        } else {
          setPinError(error.message || 'Ndodhi një gabim gjatë fshirjes. Ju lutem provoni përsëri.');
        }
      }
    } catch (error) {
      console.error('Error in delete process:', error);
      setPinError('Ndodhi një gabim i papritur. Ju lutem provoni përsëri.');
    } finally {
      setIsDeleting(false);
    }
  };

  const openModal = (id) => {
    setSelectedPatientId(id);
    setIsOpen(true);
    setPin('');
    setPinError('');
  };

  const closeModal = () => {
    setSelectedPatientId(null);
    setIsOpen(false);
    setPinError('');
    setPin('');
  };

  // Check if user is admin - only admins should be able to delete patients
  const canDelete = user && user.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-8">
        <PageHeader />
        <SearchFilterBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        
        {deleteSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
            {deleteSuccessMessage}
          </div>
        )}
        
        <PatientTable 
          filteredPatients={filteredPatients}
          openModal={openModal}
          canDelete={canDelete}
        />
        
        <DeleteModal 
          isOpen={isOpen}
          closeModal={closeModal}
          selectedPatientId={selectedPatientId}
          pin={pin}
          setPin={setPin}
          pinError={pinError}
          isDeleting={isDeleting}
          handleDelete={handleDelete}
        />
        
        <QuickStats patients={patients} />
      </div>
    </div>
  );
};

export default Dashboard;