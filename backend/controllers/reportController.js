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

// Open Outlook with email and PDF attachment
reportController.openOutlookWithAttachment = async (req, res) => {
  try {
    const { email, pdfBase64, filename, includeLogos } = req.body;
    const reportId = req.params.id;

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

    // Create email subject and body
    const patientName = report.patientId 
      ? `${report.patientId.firstName} ${report.patientId.lastName}`
      : 'Patient';
    const subject = `Report for ${patientName}`;
    const body = `Dear Recipient,\n\nPlease find attached the medical report for ${patientName}.\n\nReport Type: ${report.reportType || 'N/A'}\n${report.referenceNumber ? `Reference Number: ${report.referenceNumber}\n` : ''}\nBest regards,\nePatologjia System`;

    // Use VBScript to open Outlook with attachment
    const fs = require('fs');
    const path = require('path');
    const { exec } = require('child_process');
    const os = require('os');

    // Create temp directory in user's temp folder
    const tempDir = path.join(os.tmpdir(), 'epatologjia-outlook');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Save PDF to temp directory
    const pdfFileName = filename || `${patientName}-${report.reportType || 'Report'}.pdf`;
    const pdfPath = path.join(tempDir, pdfFileName);
    fs.writeFileSync(pdfPath, pdfBuffer);

    // Use VBScript to open Outlook with attachment
    // Write values as VBScript variables using a simple and safe approach
    
    // Helper to safely convert string to VBScript string literal
    // Simply doubles quotes (VBScript standard escaping)
    const toVBSString = (str) => {
      if (!str) return '""';
      // Normalize line endings first
      let normalized = str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      // Split by newlines and join with vbCrLf
      const lines = normalized.split('\n');
      if (lines.length === 1) {
        // No newlines, just escape quotes
        return `"${lines[0].replace(/"/g, '""')}"`;
      }
      // Has newlines, build concatenated string
      const escapedLines = lines.map(line => `"${line.replace(/"/g, '""')}"`);
      return escapedLines.join(' & vbCrLf & ');
    };
    
    // For file path, use forward slashes (Windows accepts both) and escape quotes
    const safePath = pdfPath.replace(/\\/g, '/').replace(/"/g, '""');
    
    const vbsEmail = toVBSString(email);
    const vbsSubject = toVBSString(subject);
    const vbsBody = toVBSString(body);
    
    // Create VBScript with safe string handling
    const vbsScript = `On Error Resume Next
Dim objOutlook, objMail
Set objOutlook = CreateObject("Outlook.Application")
If Err.Number <> 0 Then
  WScript.Echo "Error: Outlook is not installed. Error: " & Err.Number & " - " & Err.Description
  WScript.Quit 1
End If

Set objMail = objOutlook.CreateItem(0)
objMail.To = ${vbsEmail}
objMail.Subject = ${vbsSubject}
objMail.Body = ${vbsBody}

' Add attachment
On Error Resume Next
objMail.Attachments.Add "${safePath}"
If Err.Number <> 0 Then
  WScript.Echo "Error adding attachment: " & Err.Number & " - " & Err.Description
  WScript.Quit 1
End If
On Error Goto 0

objMail.Display

Set objMail = Nothing
Set objOutlook = Nothing
WScript.Quit 0`;

    const vbsPath = path.join(tempDir, 'openOutlook.vbs');
    // Write VBScript file with UTF-8 encoding
    fs.writeFileSync(vbsPath, vbsScript, { encoding: 'utf8' });

    console.log('VBScript created at:', vbsPath);
    console.log('PDF path:', pdfPath);
    console.log('PDF exists:', fs.existsSync(pdfPath));
    console.log('PDF file size:', fs.existsSync(pdfPath) ? fs.statSync(pdfPath).size : 'N/A');
    console.log('VBScript content (first 500 chars):', vbsScript.substring(0, 500));

    // Execute VBScript using wscript (better for GUI apps like Outlook)
    // wscript runs in the current user's desktop session
    const vbsCommand = `wscript "${vbsPath}"`;
    console.log('Executing command:', vbsCommand);
    
    // Use spawn instead of exec to run in background without blocking
    const { spawn } = require('child_process');
    const wscriptProcess = spawn('wscript', [vbsPath], {
      windowsHide: false,
      detached: true,
      stdio: 'ignore'
    });
    
    // Don't wait for the process - let it run independently
    wscriptProcess.unref();
    
    console.log('VBScript process started, PID:', wscriptProcess.pid);
    
    // Clean up VBS file after a delay
    setTimeout(() => {
      try {
        if (fs.existsSync(vbsPath)) {
          fs.unlinkSync(vbsPath);
          console.log('VBScript file cleaned up');
        }
      } catch (err) {
        console.error('Error cleaning up VBS file:', err);
      }
    }, 5000);

    // Clean up PDF file after 10 minutes (Outlook needs it until email is sent)
    // This gives user enough time to send the email
    setTimeout(() => {
      try {
        if (fs.existsSync(pdfPath)) {
          fs.unlinkSync(pdfPath);
          console.log('PDF file cleaned up:', pdfPath);
        }
      } catch (err) {
        console.error('Error cleaning up PDF file:', err);
      }
    }, 10 * 60 * 1000); // 10 minutes

    // Also clean up old files in temp directory (older than 1 hour) to prevent disk space issues
    try {
      const files = fs.readdirSync(tempDir);
      const now = Date.now();
      files.forEach(file => {
        const filePath = path.join(tempDir, file);
        try {
          const stats = fs.statSync(filePath);
          const fileAge = now - stats.mtimeMs;
          // Delete files older than 1 hour
          if (fileAge > 60 * 60 * 1000) {
            fs.unlinkSync(filePath);
            console.log('Old file cleaned up:', filePath);
          }
        } catch (err) {
          // Ignore errors for individual files
        }
      });
    } catch (err) {
      // Ignore errors if directory doesn't exist or can't be read
    }

    // Return success immediately (don't wait for VBScript execution)
    res.json({ 
      message: 'Outlook is being opened with attachment',
      success: true
    });
  } catch (error) {
    console.error('Error opening Outlook with attachment:', error);
    res.status(500).json({ 
      message: 'Error opening Outlook',
      error: error.message 
    });
  }
};

// Export the controller
module.exports = reportController;