const Report = require('../models/Report');
const Patient = require('../models/Patient');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const BaseEmailService = require('../services/email/baseEmailService');

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

// Send report via email with PDF attachment
reportController.sendReportEmail = async (req, res) => {
  try {
    const { email, pdfBase64, filename, includeLogos } = req.body;
    const reportId = req.params.id; // Get report ID from URL parameter

    if (!email || !pdfBase64) {
      return res.status(400).json({ message: 'Email and PDF data are required' });
    }

    // Get report to include patient info in email
    const report = await Report.findById(reportId).populate('patientId');
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Convert base64 to buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

    // Create email service instance
    const emailService = new BaseEmailService();

    // Create email subject and body
    const patientName = report.patientId 
      ? `${report.patientId.firstName} ${report.patientId.lastName}`
      : 'Patient';
    const subject = `Report for ${patientName}`;
    
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>ePatologjia Report</h2>
          </div>
          <div class="content">
            <p>Dear Recipient,</p>
            <p>Please find attached the medical report for <strong>${patientName}</strong>.</p>
            <p>Report Type: <strong>${report.reportType || 'N/A'}</strong></p>
            ${report.referenceNumber ? `<p>Reference Number: <strong>${report.referenceNumber}</strong></p>` : ''}
            <p>Best regards,<br>ePatologjia System</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textTemplate = `Report for ${patientName}\n\nPlease find attached the medical report.\n\nReport Type: ${report.reportType || 'N/A'}\n${report.referenceNumber ? `Reference Number: ${report.referenceNumber}\n` : ''}\nBest regards,\nePatologjia System`;

    // Send email with attachment
    const emailSent = await emailService.sendEmailWithAttachment(
      email,
      subject,
      htmlTemplate,
      textTemplate,
      pdfBuffer,
      filename || `${patientName}-${report.reportType || 'Report'}.pdf`
    );

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send email' });
    }

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending report email:', error);
    res.status(500).json({ 
      message: 'Error sending email',
      error: error.message 
    });
  }
};

// Export the controller
module.exports = reportController;