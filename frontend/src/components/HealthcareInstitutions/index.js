// components/HealthcareInstitutions/index.js
import React, { useState, useEffect } from 'react';
import { getPatients, getReports } from '../../services/api';
import { Activity } from 'lucide-react';
import InstitutionList from './InstitutionList';
import InstitutionDetail from './InstitutionDetail';
import MonthlyReports from './MonthlyReports';
import { calculateInstitutionStats } from './utils';

const HealthcareInstitutions = () => {
  // State management
  const [patients, setPatients] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [institutionStats, setInstitutionStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching data for HealthcareInstitutions...');
      const [patientsRes, reportsRes] = await Promise.all([
        getPatients(),
        getReports()
      ]);
      
      // Initialize with empty arrays if responses are undefined
      const patientsData = Array.isArray(patientsRes) ? patientsRes : [];
      const reportsData = Array.isArray(reportsRes) ? reportsRes : [];
      
      console.log(`Fetched ${patientsData.length} patients and ${reportsData.length} reports`);
      
      // Log sample data structure to help with debugging
      if (patientsData.length > 0) {
        console.log('Sample patient data structure:', JSON.stringify({
          _id: patientsData[0]._id,
          firstName: patientsData[0].firstName,
          lastName: patientsData[0].lastName
        }, null, 2));
      }
      
      if (reportsData.length > 0) {
        console.log('Sample report data structure:', JSON.stringify({
          _id: reportsData[0]._id,
          patientId: reportsData[0].patientId,
          patientIdType: typeof reportsData[0].patientId,
          isPatientIdObject: typeof reportsData[0].patientId === 'object',
          hasPatientProperties: reportsData[0].patientId && typeof reportsData[0].patientId === 'object' ? 
            Boolean(reportsData[0].patientId.firstName) : false
        }, null, 2));
      }
      
      setPatients(patientsData);
      setReports(reportsData);
      
      // Calculate institution statistics
      const stats = calculateInstitutionStats(reportsData);
      setInstitutionStats(stats);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
      // Initialize with empty arrays on error
      setPatients([]);
      setReports([]);
      setInstitutionStats([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data after updates
  const refreshData = async () => {
    try {
      console.log('Refreshing data...');
      const [updatedReports, updatedPatients] = await Promise.all([
        getReports(),
        getPatients()
      ]);
      
      console.log(`Refreshed data: ${updatedReports?.length || 0} reports, ${updatedPatients?.length || 0} patients`);
      
      setReports(updatedReports || []);
      setPatients(updatedPatients || []);
      
      const stats = calculateInstitutionStats(updatedReports || []);
      setInstitutionStats(stats);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Failed to refresh data');
    }
  };

  // Loading state
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
        {!selectedInstitution && (
          <InstitutionList 
            institutionStats={institutionStats} 
            reports={reports}
            onSelectInstitution={setSelectedInstitution} 
          />
        )}

        {selectedInstitution && !selectedMonth && (
          <InstitutionDetail 
            selectedInstitution={selectedInstitution}
            institutionStats={institutionStats}
            reports={reports}
            onBack={() => setSelectedInstitution(null)}
            onSelectMonth={setSelectedMonth}
          />
        )}

        {selectedMonth && (
          <MonthlyReports 
            selectedInstitution={selectedInstitution}
            selectedMonth={selectedMonth}
            reports={reports}
            patients={patients}
            onBack={() => setSelectedMonth(null)}
            onRefreshData={refreshData}
          />
        )}
      </div>
    </div>
  );
};

export default HealthcareInstitutions;