// components/ReferringDoctors/utils.js

// Get all doctors from a report (main + additional doctors)
export const getAllDoctors = (report) => {
    const doctors = [];
    
    // Add main referring doctor if exists
    if (report.referringDoctor) {
      doctors.push(report.referringDoctor);
    }
    
    // Parse and add additional doctors if they exist
    if (report.referringDoctors) {
      try {
        const parsedDoctors = JSON.parse(report.referringDoctors);
        if (Array.isArray(parsedDoctors)) {
          doctors.push(...parsedDoctors.filter(doctor => 
            doctor && 
            doctor.trim() !== '' && 
            doctor !== report.referringDoctor // Avoid duplicates
          ));
        }
      } catch (error) {
        console.error('Error parsing referring doctors:', error);
      }
    }
    
    return doctors;
  };
  
  // Calculate doctor stats from reports data
  export const calculateDoctorStats = (reportsData) => {
    if (!Array.isArray(reportsData) || reportsData.length === 0) {
      return [];
    }
  
    const stats = {};
    
    reportsData.forEach(report => {
      const doctors = getAllDoctors(report);
      
      // Skip if no doctors
      if (doctors.length === 0) return;
      
      // Process each doctor in the report
      doctors.forEach(doctor => {
        if (!stats[doctor]) {
          stats[doctor] = {
            name: doctor,
            total: 0,
            completed: 0,
            controlled: 0,
            notCreated: 0,
            paid: 0,
            pending: 0,
            unpaid: 0,
            totalAmount: 0,
            institutions: new Set(),
            reportTypes: new Set()
          };
        }
  
        // Update stats
        const doctorStats = stats[doctor];
        doctorStats.total += 1;
        doctorStats.totalAmount += Number(report.price) || 0;
        
        if (report.healthcareInstitution) {
          doctorStats.institutions.add(report.healthcareInstitution);
        }
        
        if (report.reportType) {
          doctorStats.reportTypes.add(report.reportType);
        }
  
        // Update report status counts
        if (report.status) {
          switch (report.status.toLowerCase()) {
            case 'completed':
              doctorStats.completed += 1;
              break;
            case 'controlled':
              doctorStats.controlled += 1;
              break;
            case 'not created':
              doctorStats.notCreated += 1;
              break;
          }
        }
  
        // Update payment status counts
        if (report.paymentStatus) {
          switch (report.paymentStatus.toLowerCase()) {
            case 'paid':
              doctorStats.paid += 1;
              break;
            case 'pending':
              doctorStats.pending += 1;
              break;
            case 'unpaid':
              doctorStats.unpaid += 1;
              break;
          }
        }
      });
    });
  
    // Convert stats object to array and sort by total reports
    const formattedStats = Object.values(stats).map(stat => ({
      ...stat,
      institutions: Array.from(stat.institutions),
      reportTypes: Array.from(stat.reportTypes)
    })).sort((a, b) => b.total - a.total);
  
    return formattedStats;
  };
  
  // Calculate monthly stats for a specific doctor
  export const calculateMonthlyStats = (selectedDoctor, reports) => {
    if (!selectedDoctor || !Array.isArray(reports)) {
      return [];
    }
  
    const stats = {};
    const doctorReports = reports.filter(report => 
      getAllDoctors(report).includes(selectedDoctor)
    );
  
    doctorReports.forEach(report => {
      if (!report.createdAt) return;
      
      const date = new Date(report.createdAt);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!stats[monthYear]) {
        stats[monthYear] = {
          total: 0,
          completed: 0,
          controlled: 0,
          notCreated: 0,
          paid: 0,
          pending: 0,
          unpaid: 0,
          totalAmount: 0,
          institutions: new Set(),
          reportTypes: new Set()
        };
      }
      
      const monthStats = stats[monthYear];
      monthStats.total += 1;
      monthStats.totalAmount += Number(report.price) || 0;
  
      if (report.healthcareInstitution) {
        monthStats.institutions.add(report.healthcareInstitution);
      }
      
      if (report.reportType) {
        monthStats.reportTypes.add(report.reportType);
      }
  
      // Update status counts
      if (report.status) {
        const status = report.status.toLowerCase();
        if (status === 'completed') monthStats.completed += 1;
        else if (status === 'controlled') monthStats.controlled += 1;
        else if (status === 'not created') monthStats.notCreated += 1;
      }
  
      // Update payment status counts
      if (report.paymentStatus) {
        const paymentStatus = report.paymentStatus.toLowerCase();
        if (paymentStatus === 'paid') monthStats.paid += 1;
        else if (paymentStatus === 'pending') monthStats.pending += 1;
        else if (paymentStatus === 'unpaid') monthStats.unpaid += 1;
      }
    });
  
    // Convert to array and format
    const formattedStats = Object.entries(stats).map(([monthYear, data]) => ({
      monthYear,
      displayMonth: new Date(monthYear + '-01').toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }),
      ...data,
      institutions: Array.from(data.institutions),
      reportTypes: Array.from(data.reportTypes)
    })).sort((a, b) => b.monthYear.localeCompare(a.monthYear));
  
    return formattedStats;
  };
  
  // Filter reports for a specific doctor and month
  export const filterMonthlyReports = (selectedMonth, selectedDoctor, reports, patients) => {
    if (!selectedMonth || !selectedDoctor || !Array.isArray(reports)) {
      console.log('Invalid parameters for filterMonthlyReports');
      return [];
    }
  
    console.log('Filtering monthly reports with:', {
      selectedMonth,
      selectedDoctor,
      reportsCount: reports.length,
      patientsCount: patients?.length || 0
    });
  
    const [year, month] = selectedMonth.split('-');
    const filteredReports = reports.filter(report => {
      if (!report.createdAt) return false;
      const date = new Date(report.createdAt);
      
      // Check if the doctor is in the list of all doctors for this report
      const isReportForDoctor = getAllDoctors(report).includes(selectedDoctor);
      
      return isReportForDoctor &&
             date.getFullYear() === parseInt(year) &&
             date.getMonth() === parseInt(month) - 1;
    });
  
    console.log(`Found ${filteredReports.length} reports for ${selectedMonth} for Dr. ${selectedDoctor}`);
  
    // Transform reports to include patient property correctly based on the data structure
    const reportsWithPatients = filteredReports.map(report => {
      // Check if patientId is already a populated object (contains patient data)
      if (report.patientId && typeof report.patientId === 'object' && report.patientId.firstName) {
        // If patientId is already a populated object, use it directly as the patient
        return {
          ...report,
          patient: report.patientId
        };
      } else {
        // If patientId is just an ID, find the patient in the patients array
        let patient = null;
        if (report.patientId && Array.isArray(patients)) {
          patient = patients.find(p => String(p._id) === String(report.patientId));
        }
        return {
          ...report,
          patient
        };
      }
    });
  
    // Log how many reports have patient data attached
    const reportsWithPatientData = reportsWithPatients.filter(r => r.patient).length;
    console.log(`${reportsWithPatientData} out of ${reportsWithPatients.length} reports have patient data`);
  
    return reportsWithPatients;
  };
  
  // Helper functions for UI display
  export const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  export const getPaymentStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'Paguar';
      case 'pending':
        return 'Ne pritje';
      case 'unpaid':
        return 'Pa paguar';
      default:
        return status || 'N/A';
    }
  };
  
  // Determine if the doctor is the main referring doctor
  export const isMainDoctor = (report, doctorName) => {
    return report.referringDoctor === doctorName;
  };