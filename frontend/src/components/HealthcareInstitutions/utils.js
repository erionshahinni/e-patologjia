// components/HealthcareInstitutions/utils.js

// Calculate institution stats from reports data
export const calculateInstitutionStats = (reportsData) => {
  if (!Array.isArray(reportsData) || reportsData.length === 0) {
    return [];
  }

  const stats = {};
  reportsData.forEach(report => {
    // Skip if no healthcare institution
    if (!report?.healthcareInstitution?.trim()) return;

    const institution = report.healthcareInstitution;
    if (!stats[institution]) {
      stats[institution] = {
        name: institution,
        total: 0,
        completed: 0,
        controlled: 0,
        notCreated: 0,
        paid: 0,
        pending: 0,
        unpaid: 0,
        totalAmount: 0,
        referringDoctors: new Set(),
        reportTypes: new Set()
      };
    }

    // Update stats
    const institutionStats = stats[institution];
    institutionStats.total += 1;
    institutionStats.totalAmount += Number(report.price) || 0;
    
    if (report.referringDoctor) {
      institutionStats.referringDoctors.add(report.referringDoctor);
    }
    
    if (report.reportType) {
      institutionStats.reportTypes.add(report.reportType);
    }

    // Update report status counts
    if (report.status) {
      switch (report.status.toLowerCase()) {
        case 'completed':
          institutionStats.completed += 1;
          break;
        case 'controlled':
          institutionStats.controlled += 1;
          break;
        case 'not created':
          institutionStats.notCreated += 1;
          break;
      }
    }

    // Update payment status counts
    if (report.paymentStatus) {
      switch (report.paymentStatus.toLowerCase()) {
        case 'paid':
          institutionStats.paid += 1;
          break;
        case 'pending':
          institutionStats.pending += 1;
          break;
        case 'unpaid':
          institutionStats.unpaid += 1;
          break;
      }
    }
  });

  // Convert stats object to array and sort by total reports
  const formattedStats = Object.values(stats).map(stat => ({
    ...stat,
    referringDoctors: Array.from(stat.referringDoctors),
    reportTypes: Array.from(stat.reportTypes)
  })).sort((a, b) => b.total - a.total);

  return formattedStats;
};

// Calculate monthly stats for a specific institution
export const calculateMonthlyStats = (selectedInstitution, reports) => {
  if (!selectedInstitution || !Array.isArray(reports)) {
    return [];
  }

  const stats = {};
  const institutionReports = reports.filter(
    report => report.healthcareInstitution === selectedInstitution
  );

  institutionReports.forEach(report => {
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
        referringDoctors: new Set(),
        reportTypes: new Set()
      };
    }
    
    const monthStats = stats[monthYear];
    monthStats.total += 1;
    monthStats.totalAmount += Number(report.price) || 0;

    if (report.referringDoctor) {
      monthStats.referringDoctors.add(report.referringDoctor);
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
    referringDoctors: Array.from(data.referringDoctors),
    reportTypes: Array.from(data.reportTypes)
  })).sort((a, b) => b.monthYear.localeCompare(a.monthYear));

  return formattedStats;
};

// Updated filterMonthlyReports function with improved patient data handling
export const filterMonthlyReports = (selectedMonth, selectedInstitution, reports, patients) => {
if (!selectedMonth || !selectedInstitution || !Array.isArray(reports)) {
  console.log('Invalid parameters for filterMonthlyReports');
  return [];
}

console.log('Filtering monthly reports with:', {
  selectedMonth,
  selectedInstitution,
  reportsCount: reports.length,
  patientsCount: patients?.length || 0
});

// First, log some example data to help with debugging
if (reports.length > 0) {
  console.log('Example report structure:', {
    _id: reports[0]._id,
    patientId: reports[0].patientId,
    hasPatientObject: typeof reports[0].patientId === 'object'
  });
}

const [year, month] = selectedMonth.split('-');
const filteredReports = reports.filter(report => {
  if (!report.createdAt) return false;
  const date = new Date(report.createdAt);
  return report.healthcareInstitution === selectedInstitution &&
         date.getFullYear() === parseInt(year) &&
         date.getMonth() === parseInt(month) - 1;
});

console.log(`Found ${filteredReports.length} reports for ${selectedMonth} at ${selectedInstitution}`);

// Transform reports to include patient property correctly based on the data structure
const reportsWithPatients = filteredReports.map(report => {
  // IMPORTANT: Check if patientId is already a populated object (contains patient data)
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

// Keep other utility functions unchanged
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