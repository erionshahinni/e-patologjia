// routes/patientRoutes.js

const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { auth } = require('../middleware/auth'); // Add authentication middleware


// Define routes with their corresponding controller functions
// All routes require authentication
router.post('/', auth, patientController.createPatient);
router.get('/', auth, patientController.getPatients);
router.get('/:id', auth, patientController.getPatientById);
router.put('/:id', auth, patientController.updatePatient);
router.delete('/:id', auth, patientController.deletePatient);

module.exports = router;