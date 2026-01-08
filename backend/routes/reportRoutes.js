const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { auth } = require('../middleware/auth'); 


// Safe handler wrapper to handle undefined functions
const safeHandler = (handler) => {
  return (req, res, next) => {
    if (typeof handler === 'function') {
      return handler(req, res, next);
    }
    console.error(`Handler is not a function: ${handler}`);
    return res.status(500).json({ message: 'Route handler not implemented' });
  };
};

// Check if reportController is properly loaded
console.log('Report controller loaded:', reportController ? 'Yes' : 'No');
if (reportController) {
  console.log('Available methods:', Object.keys(reportController));
}

// Get all reports
router.get('/', auth, safeHandler(reportController.getReports));

// Get reports for a specific patient
router.get('/patient/:patientId', auth, safeHandler(reportController.getReportsByPatientId));

// Create a new report
router.post('/', auth, safeHandler(reportController.createReport));

// Send report via email with PDF attachment (must be before /:id routes)
router.post('/:id/send-email', auth, safeHandler(reportController.sendReportEmail));

// Open Outlook with email and PDF attachment (must be before /:id routes)
router.post('/:id/open-outlook', auth, safeHandler(reportController.openOutlookWithAttachment));

// Get a specific report
router.get('/:id', auth, safeHandler(reportController.getReportById));

// Update a report
router.put('/:id', auth, safeHandler(reportController.updateReport));

// Delete a report
router.delete('/:id', auth, safeHandler(reportController.deleteReport));

module.exports = router;