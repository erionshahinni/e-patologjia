// components/Statistics/index.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, DollarSign, Calendar, Wallet, UserCircle, ArrowUp, ArrowDown, CheckCircle2, XCircle, Clock, ArrowRightLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { getReports, getPatients } from '../../services/api';
import PaymentStatusChanges from './PaymentStatusChanges';

const StatisticsDashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('daily');
  const [statusChangesTab, setStatusChangesTab] = useState('all');
  const [totalStats, setTotalStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    unpaid: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    unpaidAmount: 0,
    statusChanges: [] // Track all payment status changes
  });
  const [timeStats, setTimeStats] = useState({
    daily: [],
    monthly: [],
    yearly: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reportsResponse, patientsResponse] = await Promise.all([
          getReports(),
          getPatients()
        ]);
        
        if (reportsResponse && (Array.isArray(reportsResponse) || Array.isArray(reportsResponse.data))) {
          const reportData = Array.isArray(reportsResponse) ? reportsResponse : reportsResponse.data;
          setReports(reportData);
          
          const patientData = Array.isArray(patientsResponse) ? patientsResponse : patientsResponse.data || [];
          setPatients(patientData);
          
          // Process reports with patient data
          const reportsWithPatients = reportData.map(report => {
            if (!report.patientId) return report;
            
            const patient = patientData.find(p => String(p._id) === String(report.patientId));
            return {
              ...report,
              patient
            };
          });
          
          processReportData(reportsWithPatients);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load necessary data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processReportData = (reportData) => {
    // Initialize counters for overall stats
    const stats = {
      total: reportData.length,
      paid: 0,
      pending: 0,
      unpaid: 0,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      unpaidAmount: 0,
      statusChanges: [] // Track all payment status changes
    };

    // Initialize period-based stats containers
    const dailyStats = {};
    const monthlyStats = {};
    const yearlyStats = {};

    // Process each report
    reportData.forEach(report => {
      const price = parseFloat(report.price) || 0;
      stats.totalAmount += price;

      // Count by payment status
      if (report.paymentStatus === 'paid') {
        stats.paid++;
        stats.paidAmount += price;
      } else if (report.paymentStatus === 'pending') {
        stats.pending++;
        stats.pendingAmount += price;
      } else {
        stats.unpaid++;
        stats.unpaidAmount += price;
      }

      // Track ALL payment status changes (not just unpaid to paid)
      if (report.previousPaymentStatus && report.statusChangedAt && 
          report.previousPaymentStatus !== report.paymentStatus) {
        stats.statusChanges.push({
          id: report._id,
          patientName: report.patient ? `${report.patient.firstName} ${report.patient.lastName}` : 'Unknown',
          amount: price,
          previousStatus: report.previousPaymentStatus,
          currentStatus: report.paymentStatus,
          changedAt: report.statusChangedAt,
          reportType: report.reportType,
          referenceNumber: report.referenceNumber || '',
          institution: report.healthcareInstitution || ''
        });
      }

      // Get date information for time-based statistics
      const createdAt = report.createdAt ? new Date(report.createdAt) : new Date();
      const dateKey = createdAt.toISOString().split('T')[0];
      const monthKey = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, '0')}`;
      const yearKey = createdAt.getFullYear().toString();

      // Daily stats
      if (!dailyStats[dateKey]) {
        dailyStats[dateKey] = { 
          date: dateKey, 
          total: 0, 
          paid: 0, 
          pending: 0, 
          unpaid: 0,
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
          unpaidAmount: 0
        };
      }
      dailyStats[dateKey].total++;
      dailyStats[dateKey].totalAmount += price;
      
      if (report.paymentStatus === 'paid') {
        dailyStats[dateKey].paid++;
        dailyStats[dateKey].paidAmount += price;
      } else if (report.paymentStatus === 'pending') {
        dailyStats[dateKey].pending++;
        dailyStats[dateKey].pendingAmount += price;
      } else {
        dailyStats[dateKey].unpaid++;
        dailyStats[dateKey].unpaidAmount += price;
      }

      // Monthly stats
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = { 
          month: monthKey, 
          total: 0, 
          paid: 0, 
          pending: 0, 
          unpaid: 0,
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
          unpaidAmount: 0
        };
      }
      monthlyStats[monthKey].total++;
      monthlyStats[monthKey].totalAmount += price;
      
      if (report.paymentStatus === 'paid') {
        monthlyStats[monthKey].paid++;
        monthlyStats[monthKey].paidAmount += price;
      } else if (report.paymentStatus === 'pending') {
        monthlyStats[monthKey].pending++;
        monthlyStats[monthKey].pendingAmount += price;
      } else {
        monthlyStats[monthKey].unpaid++;
        monthlyStats[monthKey].unpaidAmount += price;
      }

      // Yearly stats
      if (!yearlyStats[yearKey]) {
        yearlyStats[yearKey] = { 
          year: yearKey, 
          total: 0, 
          paid: 0, 
          pending: 0, 
          unpaid: 0,
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
          unpaidAmount: 0
        };
      }
      yearlyStats[yearKey].total++;
      yearlyStats[yearKey].totalAmount += price;
      
      if (report.paymentStatus === 'paid') {
        yearlyStats[yearKey].paid++;
        yearlyStats[yearKey].paidAmount += price;
      } else if (report.paymentStatus === 'pending') {
        yearlyStats[yearKey].pending++;
        yearlyStats[yearKey].pendingAmount += price;
      } else {
        yearlyStats[yearKey].unpaid++;
        yearlyStats[yearKey].unpaidAmount += price;
      }
    });

    // Sort status changes by change date (newest first)
    stats.statusChanges.sort((a, b) => {
      return new Date(b.changedAt) - new Date(a.changedAt);
    });

    // Convert hash maps to arrays and sort by date
    const dailyArray = Object.values(dailyStats).sort((a, b) => b.date.localeCompare(a.date));
    const monthlyArray = Object.values(monthlyStats).sort((a, b) => b.month.localeCompare(a.month));
    const yearlyArray = Object.values(yearlyStats).sort((a, b) => b.year.localeCompare(a.year));

    // Update state with processed data
    setTotalStats(stats);
    setTimeStats({
      daily: dailyArray,
      monthly: monthlyArray,
      yearly: yearlyArray
    });
  };

  // Filter status changes based on tab
  const getFilteredStatusChanges = () => {
    if (statusChangesTab === 'all') {
      return totalStats.statusChanges;
    }

    return totalStats.statusChanges.filter(change => {
      if (statusChangesTab === 'to-paid') {
        return change.currentStatus === 'paid';
      } else if (statusChangesTab === 'to-unpaid') {
        return change.currentStatus === 'unpaid';
      } else if (statusChangesTab === 'to-pending') {
        return change.currentStatus === 'pending';
      }
      return true;
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatMonth = (monthString) => {
    const [year, month] = monthString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="bg-red-100 text-red-600 p-3 rounded-full inline-flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Error Loading Data</h3>
              <p className="text-gray-500">{error}</p>
              <button 
                onClick={() => navigate('/')}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Return to Dashboard
              </button>
            </div>
          </CardContent>
        </Card>
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
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Financial Statistics</h1>
              <p className="text-gray-500">
                Monitor payments and financial metrics
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Reports</p>
                  <h3 className="text-2xl font-bold">{totalStats.total}</h3>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <UserCircle className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">Total Value:</span>
                <span className="ml-2 font-semibold">{formatCurrency(totalStats.totalAmount)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Paid Reports</p>
                  <h3 className="text-2xl font-bold">{totalStats.paid}</h3>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">Collected:</span>
                <span className="ml-2 font-semibold text-green-600">{formatCurrency(totalStats.paidAmount)}</span>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                {totalStats.total > 0 ? ((totalStats.paid / totalStats.total) * 100).toFixed(1) : 0}% of total reports
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Reports</p>
                  <h3 className="text-2xl font-bold">{totalStats.pending}</h3>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">Pending Amount:</span>
                <span className="ml-2 font-semibold text-orange-600">{formatCurrency(totalStats.pendingAmount)}</span>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                {totalStats.total > 0 ? ((totalStats.pending / totalStats.total) * 100).toFixed(1) : 0}% of total reports
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Unpaid Reports</p>
                  <h3 className="text-2xl font-bold">{totalStats.unpaid}</h3>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                  <XCircle className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">Unpaid Amount:</span>
                <span className="ml-2 font-semibold text-red-600">{formatCurrency(totalStats.unpaidAmount)}</span>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                {totalStats.total > 0 ? ((totalStats.unpaid / totalStats.total) * 100).toFixed(1) : 0}% of total reports
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Status Changes */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5" />
                Payment Status Changes
              </CardTitle>
              <CardDescription>Track all payment status transitions</CardDescription>
            </div>
            <Tabs value={statusChangesTab} onValueChange={setStatusChangesTab} className="mt-4 md:mt-0">
              <TabsList className="grid grid-cols-4 w-full md:w-auto">
                <TabsTrigger value="all">All Changes</TabsTrigger>
                <TabsTrigger value="to-paid">To Paid</TabsTrigger>
                <TabsTrigger value="to-unpaid">To Unpaid</TabsTrigger>
                <TabsTrigger value="to-pending">To Pending</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <PaymentStatusChanges statusChanges={getFilteredStatusChanges()} />
          </CardContent>
        </Card>

        {/* Time-based Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Statistics</CardTitle>
            <CardDescription>View statistics by day, month, or year</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
              
              {/* Daily Statistics */}
              <TabsContent value="daily">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unpaid</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unpaid Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {timeStats.daily.length > 0 ? (
                        timeStats.daily.map((day, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDate(day.date)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.total}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{day.paid}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">{day.pending}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{day.unpaid}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(day.totalAmount)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{formatCurrency(day.paidAmount)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{formatCurrency(day.unpaidAmount)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">No daily data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              {/* Monthly Statistics */}
              <TabsContent value="monthly">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unpaid</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unpaid Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {timeStats.monthly.length > 0 ? (
                        timeStats.monthly.map((month, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatMonth(month.month)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{month.total}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{month.paid}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">{month.pending}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{month.unpaid}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(month.totalAmount)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{formatCurrency(month.paidAmount)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{formatCurrency(month.unpaidAmount)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">No monthly data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              {/* Yearly Statistics */}
              <TabsContent value="yearly">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unpaid</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unpaid Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {timeStats.yearly.length > 0 ? (
                        timeStats.yearly.map((year, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{year.year}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{year.total}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{year.paid}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">{year.pending}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{year.unpaid}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(year.totalAmount)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{formatCurrency(year.paidAmount)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{formatCurrency(year.unpaidAmount)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">No yearly data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsDashboard;