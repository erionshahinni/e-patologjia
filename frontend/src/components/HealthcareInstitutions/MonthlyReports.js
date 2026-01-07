// components/HealthcareInstitutions/MonthlyReports.js
import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Check,
  Download,
  Filter,
  Eye,
  UserCircle,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { updateReport, getPatientById } from '../../services/api';
import * as XLSX from 'xlsx';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import Badge from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import Button from "../../components/ui/button";
import { filterMonthlyReports, getPaymentStatusColor, getPaymentStatusText } from './utils';

const MonthlyReports = ({ 
  selectedInstitution, 
  selectedMonth, 
  reports, 
  patients,
  onBack,
  onRefreshData 
}) => {
  // State management
  const [sortBy, setSortBy] = useState('all');
  const [monthlyReports, setMonthlyReports] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [patientCache, setPatientCache] = useState({});

  // Debug info - log what props we're receiving
  useEffect(() => {
    console.log('MonthlyReports props:', { 
      selectedInstitution, 
      selectedMonth, 
      reportsCount: Array.isArray(reports) ? reports.length : 0,
      patientsCount: Array.isArray(patients) ? patients.length : 0
    });

    // Also examine a sample patient and report
    if (Array.isArray(patients) && patients.length > 0) {
      console.log('Sample patient:', patients[0]);
    }
    if (Array.isArray(reports) && reports.length > 0) {
      console.log('Sample report:', reports[0]);
      // Check if patientId is populated
      if (reports[0].patientId) {
        console.log('PatientId type:', typeof reports[0].patientId);
        if (typeof reports[0].patientId === 'object') {
          console.log('PatientId is already populated:', reports[0].patientId);
        }
      }
    }
  }, [selectedInstitution, selectedMonth, reports, patients]);

  // Update reports when dependencies change
  useEffect(() => {
    if (selectedMonth && selectedInstitution && Array.isArray(reports)) {
      const filtered = filterMonthlyReports(selectedMonth, selectedInstitution, reports, patients);
      console.log('Filtered monthly reports:', filtered);
      setMonthlyReports(filtered);
      setSelectedReports([]);
    }
  }, [selectedMonth, selectedInstitution, reports, patients, sortBy]);

  // Fetch patient data if needed
  const fetchPatientIfNeeded = async (patientId) => {
    if (!patientId) return null;
    
    // Check if we already have this patient in our cache
    if (patientCache[patientId]) {
      return patientCache[patientId];
    }
    
    try {
      console.log(`Fetching patient data for ID: ${patientId}`);
      const patientData = await getPatientById(patientId);
      
      // Update the cache
      if (patientData) {
        setPatientCache(prev => ({
          ...prev,
          [patientId]: patientData
        }));
        return patientData;
      }
    } catch (error) {
      console.error(`Error fetching patient ${patientId}:`, error);
    }
    
    return null;
  };

  // Fetch missing patient data
  useEffect(() => {
    const fetchMissingPatientData = async () => {
      const updatedReports = [...monthlyReports];
      let hasUpdates = false;
      
      // For each report without patient data but with patientId
      for (let i = 0; i < updatedReports.length; i++) {
        const report = updatedReports[i];
        if (!report.patient && report.patientId && typeof report.patientId !== 'object') {
          const patientData = await fetchPatientIfNeeded(report.patientId);
          if (patientData) {
            updatedReports[i] = { ...report, patient: patientData };
            hasUpdates = true;
          }
        }
      }
      
      // Update state only if we found missing patient data
      if (hasUpdates) {
        setMonthlyReports(updatedReports);
      }
    };
    
    if (monthlyReports.length > 0) {
      fetchMissingPatientData();
    }
  }, [monthlyReports]);

  // Filtered reports based on payment status
  const filteredReports = React.useMemo(() => {
    if (!Array.isArray(monthlyReports)) return [];
    
    return monthlyReports.filter(report => {
      if (!report?.paymentStatus) return sortBy === 'all';
      const status = report.paymentStatus.toLowerCase();
      if (sortBy === 'paid') return status === 'paid';
      if (sortBy === 'pending') return status === 'pending';
      if (sortBy === 'unpaid') return status === 'unpaid';
      return true;
    });
  }, [monthlyReports, sortBy]);

  // Handle report selection
  const handleReportSelect = (reportId) => {
    setSelectedReports(prev => {
      if (prev.includes(reportId)) {
        return prev.filter(id => id !== reportId);
      } else {
        return [...prev, reportId];
      }
    });
  };

  // Handle select all reports
  const handleSelectAllReports = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(filteredReports.map(report => report._id));
    }
  };

  // Helper function to get referring doctors from report
  const getReferringDoctors = (report) => {
    const mainDoctor = report.referringDoctor;
    let additionalDoctors = [];

    // Try to parse the referringDoctors field if it exists
    if (report.referringDoctors) {
      try {
        const parsed = JSON.parse(report.referringDoctors);
        if (Array.isArray(parsed)) {
          additionalDoctors = parsed.filter(doctor => doctor && doctor.trim() !== '');
        }
      } catch (error) {
        console.error('Error parsing referringDoctors:', error);
      }
    }

    return {
      mainDoctor,
      additionalDoctors,
      all: [
        ...(mainDoctor ? [mainDoctor] : []), 
        ...additionalDoctors
      ]
    };
  };

  // Handle bulk payment status update
  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedReports.length === 0) {
      alert('No reports selected');
      return;
    }
    
    try {
      setIsUpdating(true);
      
      // Update each selected report
      const updatePromises = selectedReports.map(reportId => {
        const report = reports.find(r => r._id === reportId);
        
        // Include original report data to track status changes
        return updateReport(reportId, { 
          ...report, 
          paymentStatus: newStatus,
          originalReport: report // Include original report to detect changes
        });
      });
      
      await Promise.all(updatePromises);
      
      // Refresh data after updates
      await onRefreshData();
      
      // Clear selected reports
      setSelectedReports([]);
      
      // Show success message in dialog
      setSuccessMessage(`Successfully updated ${selectedReports.length} reports to ${getPaymentStatusText(newStatus)}`);
      setIsSuccessDialogOpen(true);
    } catch (error) {
      console.error('Error updating reports:', error);
      alert('There was an error updating the payment status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Function to get the payment status display text
  const getPaymentStatusDisplay = (report) => {
    const status = report.paymentStatus?.toLowerCase();
    if (status === 'paid') return 'Paguar';
    if (status === 'pending') return 'Ne pritje';
    return 'Pa paguar';
  };

  // Excel export function with fixed patient name handling
  const downloadExcel = (status) => {
    if (!Array.isArray(monthlyReports) || monthlyReports.length === 0) return;
    
    let dataToExport = monthlyReports;
    
    if (status !== 'all') {
      dataToExport = monthlyReports.filter(r => 
        r?.paymentStatus?.toLowerCase() === status
      );
    }

    const excelData = dataToExport.map(report => {
      const doctors = getReferringDoctors(report);
      
      // Get patient name with better handling of data structure
      let patientName = 'Unknown';
      
      // First check the patient property
      if (report.patient && (report.patient.firstName || report.patient.lastName)) {
        patientName = `${report.patient.firstName || ''} ${report.patient.lastName || ''}`.trim();
      } 
      // Then check if patientId is a populated object
      else if (report.patientId && typeof report.patientId === 'object' && 
              (report.patientId.firstName || report.patientId.lastName)) {
        patientName = `${report.patientId.firstName || ''} ${report.patientId.lastName || ''}`.trim();
      }
      
      return {
        'Patient Name': patientName,
        'Payment Status': getPaymentStatusText(report.paymentStatus),
        'Reference': report.referenceNumber || '',
        'Report Type': report.reportType || '',
        'Status': report.status || '',
        'Price': report.price || 0,
        'Created Date': report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '',
        'Primary Referring Doctor': report.referringDoctor || '',
        'Additional Doctors': doctors.additionalDoctors.join(', ')
      };
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reports');

    const fileName = `${selectedInstitution}_${new Date(selectedMonth + '-01').toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })}_${status || 'all'}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  return (
    <>
      <button
        onClick={onBack}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span className="font-medium">Kthehu tek Institucioni</span>
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {new Date(selectedMonth + '-01').toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
              })}
            </h1>
            <p className="text-gray-600 mt-1">{selectedInstitution}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Raportet Total</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{filteredReports.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  ${filteredReports.reduce((sum, r) => sum + (Number(r.price) || 0), 0).toFixed(2)}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  ${filteredReports
                    .filter(r => r.paymentStatus?.toLowerCase() === 'paid')
                    .reduce((sum, r) => sum + (Number(r.price) || 0), 0)
                    .toFixed(2)}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Unpaid</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  ${filteredReports
                    .filter(r => r.paymentStatus?.toLowerCase() === 'unpaid')
                    .reduce((sum, r) => sum + (Number(r.price) || 0), 0)
                    .toFixed(2)}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions Panel */}
      {selectedReports.length > 0 && (
        <Card className="bg-blue-100 border-blue-300 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-full">
                  <Check className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-900">
                    {selectedReports.length} {selectedReports.length === 1 ? 'report' : 'reports'} selected
                  </p>
                  <p className="text-sm text-blue-800">
                    Total amount: ${filteredReports
                      .filter(r => selectedReports.includes(r._id))
                      .reduce((sum, r) => sum + (Number(r.price) || 0), 0)
                      .toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleBulkStatusUpdate('paid')}
                  disabled={isUpdating}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Paid
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('pending')}
                  disabled={isUpdating}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Mark as Pending
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('unpaid')}
                  disabled={isUpdating}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Mark as Unpaid
                </button>
                <button
                  onClick={() => setSelectedReports([])}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports List */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Lista e Raporteve</CardTitle>
                <CardDescription className="mt-1">Raportet për {selectedInstitution}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] border-gray-300">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Të gjitha raportet</SelectItem>
                  <SelectItem value="paid">Raportet e paguara</SelectItem>
                  <SelectItem value="pending">Raportet në pritje</SelectItem>
                  <SelectItem value="unpaid">Raportet pa paguar</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={downloadExcel}>
                <SelectTrigger className="w-[180px] border-gray-300">
                  <Download className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Download Excel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Të gjitha raportet</SelectItem>
                  <SelectItem value="paid">Raportet e paguara</SelectItem>
                  <SelectItem value="pending">Raportet në pritje</SelectItem>
                  <SelectItem value="unpaid">Raportet pa paguar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4">
            <button
              onClick={handleSelectAllReports}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Check className="h-4 w-4 mr-2" />
              {selectedReports.length === filteredReports.length
                ? "Zhbëj të gjitha"
                : "Zgjidh të gjitha raportet"}
            </button>
          </div>

          <div className="space-y-3">
            {filteredReports.map((report) => {
              // Parse and display referring doctors
              const doctors = getReferringDoctors(report);
              
              // Get patient name with better handling
              const patientName = (() => {
                // First try to get name from the patient property
                if (report.patient && (report.patient.firstName || report.patient.lastName)) {
                  return `${report.patient.firstName || ''} ${report.patient.lastName || ''}`.trim();
                } 
                // Then try to get it from the populated patientId if it's an object
                else if (report.patientId && typeof report.patientId === 'object' && 
                        (report.patientId.firstName || report.patientId.lastName)) {
                  return `${report.patientId.firstName || ''} ${report.patientId.lastName || ''}`.trim();
                }
                // Fallback to Unknown
                else {
                  return 'Unknown';
                }
              })();
              
              return (
                <div key={report._id} className="flex items-start justify-between p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all group">
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedReports.includes(report._id)}
                      onChange={() => handleReportSelect(report._id)}
                      className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 rounded-lg bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                        <FileText className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        {/* Single line with all main info together */}
                        <div className="flex items-center flex-wrap gap-3">
                          <p className="font-semibold text-gray-900">{patientName}</p>
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold ${
                            report.paymentStatus?.toLowerCase() === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                            report.paymentStatus?.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          }`}>
                            <span className={`inline-block w-2 h-2 rounded-full ${
                              report.paymentStatus?.toLowerCase() === 'paid' ? 'bg-emerald-500' : 
                              report.paymentStatus?.toLowerCase() === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                            }`}></span>
                            {getPaymentStatusDisplay(report)}
                          </span>
                          <span className="text-sm text-gray-600 font-medium">Ref: {report.referenceNumber || ''}</span>
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <UserCircle className="h-4 w-4" />
                            {doctors.mainDoctor ? `Dr. ${doctors.mainDoctor}` : ''}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {/* Additional doctors if they exist */}
                        {doctors.additionalDoctors.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {doctors.additionalDoctors.map((doctor, idx) => (
                              <span key={idx} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md font-medium">
                                Dr. {doctor}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">${report.price || 0}</p>
                      <p className="text-xs text-gray-600 font-medium">{report.reportType}</p>
                    </div>
                    <Link
                      to={`/view-report/${report._id}`}
                      className="inline-flex items-center p-2 border border-gray-300 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                      title="Shiko raportin"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Nuk u gjet asnjë raport për filtrin e zgjedhur</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
              Sukses
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-gray-700">{successMessage}</p>
          </div>
          <div className="flex justify-center gap-4 pb-4">
            <Button 
              onClick={() => setIsSuccessDialogOpen(false)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <CheckCircle2 className="h-4 w-4" />
              Në rregull
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MonthlyReports;