// components/ReferringDoctors/index.js
import React, { useState, useEffect } from 'react';
import { getPatients, getReports } from '../../services/api';
import { Activity } from 'lucide-react';
import DoctorList from './DoctorList';
import DoctorDetail from './DoctorDetail';
import MonthlyReports from './MonthlyReports';
import { calculateDoctorStats } from './utils';

const ReferringDoctors = () => {
  // State management
  const [patients, setPatients] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [doctorStats, setDoctorStats] = useState([]);
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

      console.log('Fetching data for ReferringDoctors...');
      const [patientsRes, reportsRes] = await Promise.all([
        getPatients(),
        getReports()
      ]);
      
      // Initialize with empty arrays if responses are undefined
      const patientsData = Array.isArray(patientsRes) ? patientsRes : [];
      const reportsData = Array.isArray(reportsRes) ? reportsRes : [];
      
      console.log(`Fetched ${patientsData.length} patients and ${reportsData.length} reports`);
      
      setPatients(patientsData);
      setReports(reportsData);
      
      // Calculate doctor statistics
      const stats = calculateDoctorStats(reportsData);
      setDoctorStats(stats);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
      // Initialize with empty arrays on error
      setPatients([]);
      setReports([]);
      setDoctorStats([]);
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
      
      const stats = calculateDoctorStats(updatedReports || []);
      setDoctorStats(stats);
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
        {!selectedDoctor && (
          <DoctorList 
            doctorStats={doctorStats} 
            reports={reports}
            onSelectDoctor={setSelectedDoctor} 
          />
        )}

        {selectedDoctor && !selectedMonth && (
          <DoctorDetail 
            selectedDoctor={selectedDoctor}
            doctorStats={doctorStats}
            reports={reports}
            onBack={() => setSelectedDoctor(null)}
            onSelectMonth={setSelectedMonth}
          />
        )}

        {selectedMonth && (
          <MonthlyReports 
            selectedDoctor={selectedDoctor}
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

export default ReferringDoctors;