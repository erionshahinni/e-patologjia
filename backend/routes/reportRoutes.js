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
router.get('/', safeHandler(reportController.getReports));

// Get reports for a specific patient
router.get('/patient/:patientId', safeHandler(reportController.getReportsByPatientId));

// Get a specific report
router.get('/:id', safeHandler(reportController.getReportById));

// Create a new report
router.post('/', safeHandler(reportController.createReport));

// Update a report
router.put('/:id', safeHandler(reportController.updateReport));

// Delete a report
router.delete('/:id', auth, safeHandler(reportController.deleteReport));

module.exports = router;