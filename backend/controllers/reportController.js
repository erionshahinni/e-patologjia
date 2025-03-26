const Report = require('../models/Report');
const Patient = require('../models/Patient');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Create a controller object
const reportController = {};

// Get all reports
reportController.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('patientId')
      .populate('templateId')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ 
      message: 'Error fetching reports',
      error: error.message 
    });
  }
};

// Get reports for a specific patient
reportController.getReportsByPatientId = async (req, res) => {
  try {
    console.log('Fetching reports for patientId:', req.params.patientId);
    
    const reports = await Report.find({ 
      patientId: req.params.patientId 
    })
    .populate('patientId')
    .populate('templateId')
    .sort({ createdAt: -1 });

    console.log(`Found ${reports.length} reports for patient`);
    res.json(reports);
  } catch (error) {
    console.error('Error in getReportsByPatientId:', error);
    res.status(500).json({ 
      message: 'Failed to fetch reports',
      error: error.message 
    });
  }
};

// Get single report by ID
reportController.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('patientId')
      .populate('templateId');
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    console.error('Error fetching report by ID:', error);
    res.status(500).json({ 
      message: 'Error fetching report',
      error: error.message 
    });
  }
};

// Create new report
reportController.createReport = async (req, res) => {
  try {
    console.log('Creating report with data:', JSON.stringify(req.body, null, 2));
    
    // Check if patient exists
    const patient = await Patient.findById(req.body.patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Create report
    const report = new Report(req.body);
    const savedReport = await report.save();
    console.log('Report created with ID:', savedReport._id);

    // Add report to patient's reports array
    await Patient.findByIdAndUpdate(
      req.body.patientId,
      { $push: { reports: savedReport._id } }
    );

    // Return populated report
    const populatedReport = await Report.findById(savedReport._id)
      .populate('patientId')
      .populate('templateId');

    res.status(201).json(populatedReport);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(400).json({ 
      message: 'Error creating report',
      error: error.message 
    });
  }
};

// Update report
reportController.updateReport = async (req, res) => {
  try {
    console.log('Updating report with data:', JSON.stringify(req.body, null, 2));
    
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Update fields
    Object.assign(report, req.body);
    const updatedReport = await report.save();

    const populatedReport = await Report.findById(updatedReport._id)
      .populate('patientId')
      .populate('templateId');

    res.json(populatedReport);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(400).json({ 
      message: 'Error updating report',
      error: error.message 
    });
  }
};


// Replace the existing exports.deleteReport with:
reportController.deleteReport = async (req, res) => {
  try {
    // Check for PIN in request
    const { pin } = req.body;
    if (!pin) {
      return res.status(400).json({ message: 'PIN is required for deletion' });
    }

    // Verify user authentication
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify the user's role and PIN
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // For admin users, verify the PIN
    if (user.role === 'admin') {
      if (!user.pin) {
        return res.status(400).json({ message: 'No PIN set for this admin user' });
      }

      const isPinValid = await bcrypt.compare(pin, user.pin);
      if (!isPinValid) {
        return res.status(401).json({ message: 'Invalid PIN' });
      }
    } else {
      // Non-admin handling
      return res.status(403).json({ message: 'Only admin users can delete reports' });
    }

    // Now proceed with the deletion
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Remove report from patient's reports array
    await Patient.findByIdAndUpdate(
      report.patientId,
      { $pull: { reports: report._id } }
    );

    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ 
      message: 'Error deleting report',
      error: error.message 
    });
  }
};

// Export the controller
module.exports = reportController;